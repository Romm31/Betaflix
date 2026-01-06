import { ImageResponse } from 'next/og';

// Route segment config
export const runtime = 'edge';

// Image metadata
export const size = {
  width: 32,
  height: 32,
};
export const contentType = 'image/png';

// Image generation
export default function Icon() {
  return new ImageResponse(
    (
      // ImageResponse JSX element
      <div
        style={{
          fontSize: 24,
          background: '#800000',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#C5A059',
          borderRadius: 8,
          position: 'relative',
        }}
      >
        {/* Abstract pattern lines */}
        <div
            style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: 8,
            }}
        />
        {/* Simple B icon */}
        <div style={{ fontWeight: 900, fontFamily: 'sans-serif', marginTop: -2 }}>
            B
        </div>
        {/* Play triangle accent */}
        <div
            style={{
                position: 'absolute',
                right: 4,
                bottom: 4,
                width: 0,
                height: 0,
                borderLeft: '6px solid #C5A059',
                borderTop: '3px solid transparent',
                borderBottom: '3px solid transparent',
            }}
        />
      </div>
    ),
    // ImageResponse options
    {
      // For convenience, we can re-use the exported icons size metadata
      // config to also set the ImageResponse's width and height.
      ...size,
    }
  );
}
