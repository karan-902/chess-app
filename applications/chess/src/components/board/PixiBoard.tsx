import { useEffect, useRef } from "react";
import {
    Application,
    Assets,
    Container,
    Graphics,
    Rectangle,
    Sprite,
    Texture,
} from "pixi.js";
import {
    ALL_PIECES,
    COLORS,
    MOVE_MS,
    boardFromFen,
    castleRookMove,
    colRowToSquare,
    computeHints,
    easeStandard,
    isDraggable,
    pieceUrl,
    squareToColRow,
    useSquareSize,
    type IChessBoardProps,
} from "./boardShared";
import "./board.scss";

type PieceSprite = Sprite & { code: string; animating: boolean };
type Move = { sprite: PieceSprite; sx: number; sy: number; tx: number; ty: number; t0: number };
type Press = { from: string; sprite: PieceSprite | null; moved: boolean; ox: number; oy: number };

const DRAG_THRESHOLD = 5;

class PixiRenderer {
    app = new Application();
    boardLayer = new Graphics();
    hintLayer = new Graphics();
    pieceLayer = new Container();
    sprites = new Map<string, PieceSprite>();
    textures: Record<string, Texture> = {};
    size = 0;
    cell = 0;
    lastMoveKey = "";
    moves: Move[] = [];
    press: Press | null = null;
    destroyed = false;
    getProps: () => IChessBoardProps;

    constructor(getProps: () => IChessBoardProps) {
        this.getProps = getProps;
    }

    async init(host: HTMLElement, size: number) {
        this.size = size;
        this.cell = size / 8;
        await this.app.init({
            width: size,
            height: size,
            backgroundAlpha: 0,
            antialias: true,
            resolution: window.devicePixelRatio || 1,
            autoDensity: true,
        });
        if (this.destroyed) return;

        host.appendChild(this.app.canvas);
        this.app.canvas.style.width = "100%";
        this.app.canvas.style.height = "100%";
        this.app.canvas.addEventListener("contextmenu", (e) => e.preventDefault());
        this.app.stage.addChild(this.boardLayer, this.hintLayer, this.pieceLayer);

        ALL_PIECES.forEach((c) =>
            Assets.add({ alias: c, src: pieceUrl(c), data: { resolution: 3 } }),
        );
        this.textures = await Assets.load(ALL_PIECES);
        if (this.destroyed) return;

        this.app.stage.eventMode = "static";
        this.app.stage.hitArea = new Rectangle(0, 0, size, size);
        this.app.stage.on("pointerdown", this.onDown);
        this.app.stage.on("globalpointermove", this.onMove);
        this.app.stage.on("pointerup", this.onUp);
        this.app.stage.on("pointerupoutside", this.onUp);
        this.app.ticker.add(this.tick);

        this.drawBoard();
        this.sync();
    }

    destroy() {
        this.destroyed = true;
        try {
            this.app.destroy(true, { children: true });
        } catch {
            this.app.canvas?.remove();
        }
    }

    resize(size: number) {
        if (!size || size === this.size || this.destroyed || !this.app.renderer) return;
        this.size = size;
        this.cell = size / 8;
        this.app.renderer.resize(size, size);
        this.app.stage.hitArea = new Rectangle(0, 0, size, size);
        this.drawBoard();
        for (const [sq, s] of this.sprites) {
            s.width = s.height = this.cell * 0.92;
            const pos = this.centerOf(sq);
            s.position.set(pos.x, pos.y);
        }
        this.drawHints();
    }

    centerOf(square: string) {
        const { col, row } = squareToColRow(square, this.getProps().flipped);
        return {
            x: col * this.cell + this.cell / 2,
            y: row * this.cell + this.cell / 2,
        };
    }

    squareAt(x: number, y: number) {
        return colRowToSquare(
            Math.floor(x / this.cell),
            Math.floor(y / this.cell),
            this.getProps().flipped,
        );
    }

    makeSprite(code: string) {
        const s = new Sprite(this.textures[code]) as PieceSprite;
        s.anchor.set(0.5);
        s.width = s.height = this.cell * 0.92;
        s.code = code;
        s.animating = false;
        this.pieceLayer.addChild(s);
        return s;
    }

    drawBoard() {
        const g = this.boardLayer;
        g.clear();
        g.roundRect(0, 0, this.size, this.size, this.cell * 0.14).fill(COLORS.dark);
        for (let r = 0; r < 8; r++) {
            for (let c = 0; c < 8; c++) {
                g.rect(c * this.cell, r * this.cell, this.cell, this.cell).fill(
                    (r + c) % 2 === 0 ? COLORS.light : COLORS.dark,
                );
            }
        }
    }

    drawHints() {
        const g = this.hintLayer;
        g.clear();
        for (const h of computeHints(this.getProps())) {
            const { col, row } = squareToColRow(h.square, this.getProps().flipped);
            const cx = col * this.cell + this.cell / 2;
            const cy = row * this.cell + this.cell / 2;
            if (h.kind === "tint")
                g.rect(col * this.cell, row * this.cell, this.cell, this.cell).fill({
                    color: h.color,
                    alpha: h.alpha,
                });
            else if (h.kind === "check")
                g.circle(cx, cy, this.cell * 0.5).fill({ color: COLORS.check, alpha: 0.55 });
            else if (h.kind === "ring")
                g.circle(cx, cy, this.cell * 0.44).stroke({
                    width: this.cell * 0.09,
                    color: h.color,
                    alpha: 0.5,
                });
            else g.circle(cx, cy, this.cell * 0.16).fill({ color: h.color, alpha: 0.6 });
        }
    }

    animateMove(from: string, to: string, board: Record<string, string>) {
        const s = this.sprites.get(from);
        if (!s) return;
        const captured = this.sprites.get(to);
        if (captured && captured !== s) {
            this.pieceLayer.removeChild(captured);
            captured.destroy();
        }
        this.sprites.delete(from);
        this.sprites.set(to, s);
        s.animating = true;
        this.pieceLayer.addChild(s);
        if (board[to]) {
            s.texture = this.textures[board[to]];
            s.code = board[to];
        }
        const target = this.centerOf(to);
        this.moves = this.moves.filter((m) => m.sprite !== s);
        this.moves.push({
            sprite: s,
            sx: s.x,
            sy: s.y,
            tx: target.x,
            ty: target.y,
            t0: performance.now(),
        });
    }

    tick = () => {
        if (!this.moves.length) return;
        const now = performance.now();
        this.moves = this.moves.filter((m) => {
            const k = Math.min(1, (now - m.t0) / MOVE_MS);
            const e = easeStandard(k);
            m.sprite.position.set(m.sx + (m.tx - m.sx) * e, m.sy + (m.ty - m.sy) * e);
            if (k >= 1) {
                m.sprite.animating = false;
                return false;
            }
            return true;
        });
    };

    sync() {
        if (this.destroyed || !this.textures.wP) return;
        const p = this.getProps();
        const board = boardFromFen(p.fen);

        const lmKey = p.lastMove ? `${p.lastMove.from}>${p.lastMove.to}` : "";
        if (p.lastMove && lmKey !== this.lastMoveKey) {
            const mover = this.sprites.get(p.lastMove.from);
            this.animateMove(p.lastMove.from, p.lastMove.to, board);
            const rook = castleRookMove(
                p.lastMove.from,
                p.lastMove.to,
                board[p.lastMove.to] ?? mover?.code ?? "",
            );
            if (rook) this.animateMove(rook.from, rook.to, board);
        }
        this.lastMoveKey = lmKey;

        for (const [sq, code] of Object.entries(board)) {
            let s = this.sprites.get(sq);
            if (!s) {
                s = this.makeSprite(code);
                this.sprites.set(sq, s);
            } else if (s.code !== code && !s.animating) {
                s.texture = this.textures[code];
                s.code = code;
            }
            if (!s.animating) {
                const pos = this.centerOf(sq);
                s.position.set(pos.x, pos.y);
            }
        }
        for (const [sq, s] of [...this.sprites]) {
            if (!board[sq] && !s.animating) {
                this.pieceLayer.removeChild(s);
                s.destroy();
                this.sprites.delete(sq);
            }
        }
        this.drawHints();
    }

    onDown = (e: { global: { x: number; y: number }; button: number }) => {
        const sq = this.squareAt(e.global.x, e.global.y);
        if (!sq) return;
        const p = this.getProps();
        if (e.button === 2) {
            p.onSquareRightClick?.(sq);
            return;
        }
        const code = boardFromFen(p.fen)[sq];
        const sprite = this.sprites.get(sq) ?? null;
        if (code && sprite && isDraggable(code, p.draggableColor)) {
            this.press = { from: sq, sprite, moved: false, ox: e.global.x, oy: e.global.y };
            sprite.animating = true;
            this.pieceLayer.addChild(sprite);
            p.onSquareClick?.(sq);
        } else {
            this.press = { from: sq, sprite: null, moved: false, ox: e.global.x, oy: e.global.y };
        }
    };

    onMove = (e: { global: { x: number; y: number } }) => {
        const press = this.press;
        if (!press?.sprite) return;
        if (
            !press.moved &&
            Math.hypot(e.global.x - press.ox, e.global.y - press.oy) < DRAG_THRESHOLD
        )
            return;
        press.moved = true;
        press.sprite.position.set(e.global.x, e.global.y);
    };

    onUp = (e: { global: { x: number; y: number } }) => {
        const press = this.press;
        this.press = null;
        if (!press) return;
        const target = this.squareAt(e.global.x, e.global.y);
        const p = this.getProps();
        if (press.sprite) {
            const home = this.centerOf(press.from);
            press.sprite.position.set(home.x, home.y);
            press.sprite.animating = false;
            if (press.moved && target && target !== press.from)
                p.onSquareClick?.(target, true);
        } else if (target) {
            p.onSquareClick?.(target);
        }
    };
}

function syncKey(p: IChessBoardProps) {
    return JSON.stringify([
        p.fen,
        p.selectedSquare,
        p.legalMoves,
        p.attackedSquares,
        p.checkSquare,
        p.stalemateSquare,
        p.flashSquare,
        p.lastMove,
        p.flipped,
        p.premoveMode,
        p.premoveSquares,
        p.premoveMoves,
        p.draggableColor,
    ]);
}

export default function PixiBoard(props: IChessBoardProps) {
    const hostRef = useRef<HTMLDivElement>(null);
    const propsRef = useRef(props);
    propsRef.current = props;
    const rendererRef = useRef<PixiRenderer | null>(null);
    const size = useSquareSize(hostRef);

    useEffect(() => {
        if (!size || rendererRef.current || !hostRef.current) return;
        const r = new PixiRenderer(() => propsRef.current);
        rendererRef.current = r;
        r.init(hostRef.current, size);
    }, [size]);

    useEffect(
        () => () => {
            rendererRef.current?.destroy();
            rendererRef.current = null;
        },
        [],
    );

    useEffect(() => {
        if (size) rendererRef.current?.resize(size);
    }, [size]);

    const key = syncKey(props);
    useEffect(() => {
        rendererRef.current?.sync();
    }, [key]);

    return <div ref={hostRef} className="lib-board-host" />;
}
