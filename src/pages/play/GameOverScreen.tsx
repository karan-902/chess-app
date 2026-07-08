import { useRef, useEffect } from "react";
import Box from "../../components/base/Box/Box";
import Text from "../../components/base/Text/Text";

interface IGameOverScreenProps {
    result: "win" | "lose" | "draw";
    reason: string;
    opponentName: string;
    opponentRating: number;
    totalMoves: number;
    elapsedTime: string;
    onNewGame: () => void;
    onClose: () => void;
}

// ── WebGL rain shader (from Stitch AI) ───────────────────────────────────────

const VS = `
attribute vec2 a_position;
varying vec2 v_texCoord;
void main() {
    v_texCoord = a_position * 0.5 + 0.5;
    gl_Position = vec4(a_position, 0.0, 1.0);
}`;

const FS = `
precision highp float;

uniform float u_time;
uniform vec2  u_resolution;

varying vec2 v_texCoord;

float hash(vec2 p) {
    p = fract(p * vec2(123.34, 456.21));
    p += dot(p, p + 45.32);
    return fract(p.x * p.y);
}

void main() {
    vec2 uv = v_texCoord;

    vec3 bg = vec3(0.008, 0.028, 0.009);

    float a = 0.785398;
    mat2 rot = mat2(cos(a), -sin(a), sin(a), cos(a));
    vec2 rotUV = (uv - 0.5) * rot + 0.5;

    vec2 rainUV = rotUV * vec2(28.0, 4.0);
    rainUV.y += u_time * 2.2;

    float id = floor(rainUV.x);
    rainUV.y += hash(vec2(id)) * 10.0;

    float droplet = fract(rainUV.y);
    droplet = pow(droplet, 11.0);

    float brightness = hash(vec2(id, floor(rainUV.y)));

    vec3 gold  = vec3(0.98, 0.80, 0.08);
    vec3 green = vec3(0.10, 0.62, 0.20);

    float pick = hash(vec2(id, 123.456));
    vec3 rain = mix(gold, green, step(0.55, pick));

    // glow intensity
    vec3 col = bg + rain * droplet * brightness * 1.05;

    gl_FragColor = vec4(col, 1.0);
}`;

function compileShader(gl: WebGLRenderingContext, type: number, src: string) {
    const s = gl.createShader(type)!;
    gl.shaderSource(s, src);
    gl.compileShader(s);
    return s;
}

function initGL(canvas: HTMLCanvasElement): (() => void) | null {
    const gl = (canvas.getContext("webgl") ??
        canvas.getContext("experimental-webgl")) as WebGLRenderingContext | null;
    if (!gl) return null;

    const prog = gl.createProgram()!;
    gl.attachShader(prog, compileShader(gl, gl.VERTEX_SHADER, VS));
    gl.attachShader(prog, compileShader(gl, gl.FRAGMENT_SHADER, FS));
    gl.linkProgram(prog);
    gl.useProgram(prog);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER,
        new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);

    const pos = gl.getAttribLocation(prog, "a_position");
    gl.enableVertexAttribArray(pos);
    gl.vertexAttribPointer(pos, 2, gl.FLOAT, false, 0, 0);

    const uTime = gl.getUniformLocation(prog, "u_time");
    const uRes  = gl.getUniformLocation(prog, "u_resolution");

    const resize = () => {
        canvas.width  = canvas.clientWidth;
        canvas.height = canvas.clientHeight;
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    const start = performance.now();
    let raf = 0;

    function render() {
        gl!.viewport(0, 0, canvas.width, canvas.height);
        gl!.uniform1f(uTime, (performance.now() - start) * 0.001);
        gl!.uniform2f(uRes, canvas.width, canvas.height);
        gl!.drawArrays(gl!.TRIANGLE_STRIP, 0, 4);
        raf = requestAnimationFrame(render);
    }
    render();

    return () => {
        cancelAnimationFrame(raf);
        ro.disconnect();
    };
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function GameOverScreen({
    result,
    reason,
    opponentName,
    opponentRating,
    totalMoves,
    elapsedTime,
    onNewGame,
    onClose,
}: IGameOverScreenProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        if (!canvasRef.current) return;
        const cleanup = initGL(canvasRef.current);
        return () => cleanup?.();
    }, []);

    const isWin  = result === "win";
    const isDraw = result === "draw";

    const headerLabel = isWin ? "VICTORY" : isDraw ? "DRAW" : "DEFEAT";
    const reasonLabel = reason.toUpperCase();
    const ratingDelta = isWin ? "+15" : isDraw ? "±0" : "-12";
    const accuracy    = isWin ? "94%" : isDraw ? "78%" : "61%";

    return (
        <Box customClass="gos-overlay">
            <canvas ref={canvasRef} className="gos-canvas" />

            <Box customClass="gos-inner">

                {/* ── Header ── */}
                <Box customClass="gos-header">
                    <button className="gos-icon-btn" onClick={onClose}>✕</button>
                    <Text as="span" customClass={`gos-title gos-title--${result}`}>
                        {headerLabel}
                    </Text>
                    <button className="gos-icon-btn">⤴</button>
                </Box>

                {/* ── Scrollable body ── */}
                <Box customClass="gos-body">

                    {/* Top stats — float on background */}
                    <Box customClass="gos-stats-row">
                        <Box customClass="gos-stat">
                            <Text as="span" customClass="gos-stat-label">MOVES</Text>
                            <Text as="span" customClass="gos-stat-value">{totalMoves}</Text>
                        </Box>
                        <Box customClass="gos-stat gos-stat--right">
                            <Text as="span" customClass="gos-stat-label">TIME</Text>
                            <Text as="span" customClass="gos-stat-value">{elapsedTime}</Text>
                        </Box>
                    </Box>

                    {/* Piece image + reason */}
                    <Box customClass="gos-piece-section">
                        <Box customClass="gos-piece-box">
                            <img
                                src="https://lh3.googleusercontent.com/aida-public/AB6AXuANh3VrAoUub5ARohg0QKlGQzMm8Ld67Uwb9X-6aD6YDoxgc9L7JocLS8l4QjMuCb5QUCg5Acvp3E4zuRCHhgDmGPA6tRkB_ASg7S2Ltv12rKiG_rWcnX3n58yKtoUktKK0rUSPCIPvrRDCsptShfA8b9ONDYsUEAsAg9GKtni2joI1dLg-oWOFkSvV-6CHNV66dg4Hrfd6WE4VXG3_AuSUijzJQwr9_tkLquyTNgihjxAZAF7fGGF5hA"
                                alt="king"
                                className="gos-piece-img gos-piece-img--photo"
                            />
                            <Box customClass="gos-match-overlay">
                                <Text as="span" customClass="gos-match-label">MATCH RESULT</Text>
                            </Box>
                        </Box>
                        <Text as="span" customClass={`gos-reason gos-reason--${result}`}>
                            {reasonLabel}
                        </Text>
                    </Box>

                    {/* Bottom stats — float on background */}
                    <Box customClass="gos-stats-row">
                        <Box customClass="gos-stat">
                            <Text as="span" customClass="gos-stat-label">RATING</Text>
                            <Text as="span" customClass={`gos-stat-value gos-rating--${result}`}>
                                {ratingDelta}
                            </Text>
                        </Box>
                        <Box customClass="gos-stat gos-stat--right">
                            <Text as="span" customClass="gos-stat-label">ACCURACY</Text>
                            <Text as="span" customClass="gos-stat-value gos-accuracy">
                                {accuracy}
                            </Text>
                        </Box>
                    </Box>

                    {/* Opponent badge */}
                    <Box customClass="gos-opponent-row">
                        <Box customClass="gos-opponent">
                            <Text as="span" customClass="gos-opponent-icon">⚙</Text>
                            <Text as="span" customClass="gos-opponent-name">
                                vs {opponentName} ({opponentRating})
                            </Text>
                        </Box>
                    </Box>

                    {/* Progress line */}
                    <Box customClass="gos-progress">
                        <Box customClass={`gos-progress-bar gos-progress-bar--${result}`} />
                    </Box>

                </Box>

                {/* ── Buttons ── */}
                <Box customClass="gos-actions">
                    <button className="gos-btn-primary" onClick={onNewGame}>
                        <Text as="span" customClass="gos-btn-icon">⊕</Text>
                        <Text as="span">New Game</Text>
                    </button>
                    <Box customClass="gos-btn-row">
                        <button className="gos-btn-secondary">
                            <Text as="span" customClass="gos-btn-icon">▦</Text>
                            <Text as="span">Analysis</Text>
                        </button>
                        <button className="gos-btn-secondary">
                            <Text as="span" customClass="gos-btn-icon">⤴</Text>
                            <Text as="span">Share</Text>
                        </button>
                    </Box>
                </Box>

            </Box>
        </Box>
    );
}
