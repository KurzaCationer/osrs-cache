import { useRef, useEffect } from 'react';

export const SpriteCanvas = ({ data }: { data: any }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas || !data) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        if (data.sprites && data.sprites.length > 0) {
            // Render first frame
            const sprite = data.sprites[0];
            const imageData = ctx.createImageData(data.width, data.height);
            const buf32 = new Uint32Array(imageData.data.buffer);
            
            for (let y = 0; y < sprite.pixelsHeight; y++) {
                for (let x = 0; x < sprite.pixelsWidth; x++) {
                    // Safety check for pixel array bounds
                    const pxIndex = y * sprite.pixelsWidth + x;
                    if (pxIndex >= sprite.pixels.length) continue;

                    const idx = sprite.pixels[pxIndex];
                    if (idx === 0) continue; // Transparency

                    // Safety check for palette bounds
                    if (idx >= data.palette.length) continue;

                    const color = data.palette[idx]; // 0xRRGGBB
                    
                    const r = (color >> 16) & 0xFF;
                    const g = (color >> 8) & 0xFF;
                    const b = color & 0xFF;
                    
                    const tx = x + sprite.offsetX;
                    const ty = y + sprite.offsetY;
                    
                    if (tx >= 0 && tx < data.width && ty >= 0 && ty < data.height) {
                        const targetIdx = ty * data.width + tx;
                        // Set pixel to Opaque (Alpha 255) + BGR (for Little Endian Uint32)
                        buf32[targetIdx] = (255 << 24) | (b << 16) | (g << 8) | r;
                    }
                }
            }
            
            ctx.putImageData(imageData, 0, 0);
        }

    }, [data]);

    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
            <canvas
                ref={canvasRef}
                width={data?.width || 0}
                height={data?.height || 0}
                data-testid="sprite-canvas"
                style={{
                    imageRendering: 'pixelated',
                    border: '1px solid #333',
                    background: 'url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAMUlEQVQ4T2NkYGAQYcAP3uCTZhw1gGGYhAGBZIA/nYDCgBDAm9BGDWAAJyRCgLaBCAAgXwixzAS0pgAAAABJRU5ErkJggg==")' // Checkerboard
                }}
            />
            <button
                onClick={() => {
                    const canvas = canvasRef.current;
                    if (canvas) {
                        const url = canvas.toDataURL('image/png');
                        const a = document.createElement('a');
                        a.href = url;
                        a.download = `sprite-${data?.id ?? 'unknown'}.png`;
                        a.click();
                    }
                }}
                style={{
                    padding: '4px 8px',
                    fontSize: '12px',
                    cursor: 'pointer'
                }}
            >
                Download PNG
            </button>
        </div>
    );
};