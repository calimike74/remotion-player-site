# Shared Asset Component Library

A collection of reusable, animated components for Remotion video compositions.

## Installation

Components are already included in the project. Import them from the assets folder:

```tsx
import { Icon, BackgroundPattern, GlassCard, AnimatedGradient } from '../shared/assets';
```

## Components

### Icon

Animated SVG icons with built-in audio/music-related icons.

```tsx
// Built-in icon with animation
<Icon name="speaker" size={64} color="#3b82f6" animation="scaleIn" />

// With delay and custom duration
<Icon name="waveform" animation="fadeIn" animationDelay={30} animationDuration={45} />

// Available icons: speaker, ear, wave, waveform, music, headphones, frequency, check, close, info, warning, play, pause
```

**Props:**
- `name`: Built-in icon name
- `size`: Icon size in pixels (default: 48)
- `color`: Icon color (default: "#ffffff")
- `animation`: "none" | "fadeIn" | "scaleIn" | "slideUp" | "slideDown" | "slideLeft" | "slideRight" | "pulse" | "bounce" | "spin"
- `animationDelay`: Delay in frames
- `animationDuration`: Duration in frames
- `stroke`: Use stroke instead of fill
- `strokeWidth`: Stroke width when using stroke mode

### BackgroundPattern

Animated background patterns for video scenes.

```tsx
// Grid pattern
<BackgroundPattern pattern="grid" primaryColor="#3b82f6" opacity={0.2} />

// Animated dots
<BackgroundPattern pattern="dots" animate animationSpeed={0.5} />

// Gradient mesh
<BackgroundPattern
  pattern="gradientMesh"
  primaryColor="#3b82f6"
  secondaryColor="#8b5cf6"
  animate
/>
```

**Props:**
- `pattern`: "grid" | "dots" | "gradientMesh" | "waves" | "circles" | "hexagons" | "noise"
- `primaryColor`: Primary pattern color
- `secondaryColor`: Secondary color for multi-color patterns
- `backgroundColor`: Background fill color
- `opacity`: Pattern opacity (0-1)
- `scale`: Pattern scale multiplier
- `animate`: Enable animation
- `animationSpeed`: Animation speed multiplier

### GlassCard

Glassmorphism card for content containers.

```tsx
// Basic glass card
<GlassCard>
  <h2>Content Here</h2>
</GlassCard>

// Animated colored variant with glow
<GlassCard
  variant="colored"
  accentColor="#3b82f6"
  animate
  glow
  glowColor="#3b82f6"
>
  <p>Important content</p>
</GlassCard>
```

**Props:**
- `variant`: "default" | "dark" | "light" | "colored" | "frosted"
- `width`, `height`: Dimensions (CSS values)
- `borderRadius`: Corner radius in pixels
- `blur`: Backdrop blur amount
- `backgroundOpacity`: Background opacity (0-1)
- `padding`: Internal padding
- `animate`: Enable entrance animation
- `animationDelay`: Animation delay in frames
- `glow`: Enable glow effect
- `glowColor`: Glow color

### AnimatedGradient

Animated gradient backgrounds.

```tsx
// Rotating linear gradient
<AnimatedGradient
  type="linear"
  colors={["#3b82f6", "#8b5cf6", "#ec4899"]}
  animate
  animationStyle="rotate"
/>

// Mesh gradient
<AnimatedGradient type="mesh" colors={gradientPresets.ocean} />

// Aurora effect
<AnimatedGradient type="aurora" colors={["#00ff87", "#60efff"]} animate />
```

**Props:**
- `type`: "linear" | "radial" | "conic" | "mesh" | "aurora" | "sunset"
- `colors`: Array of color values
- `stops`: Custom gradient stops with positions
- `speed`: Animation speed
- `angle`: Starting angle for linear gradients
- `animate`: Enable animation
- `animationStyle`: "rotate" | "shift" | "pulse"
- `opacity`: Overall opacity

**Presets:**
```tsx
import { gradientPresets } from '../shared/assets';
// Available: ocean, sunset, forest, midnight, candy, neon, fire, ice, purple, earth
```

## Asset Folders

Static assets should be placed in `/public/assets/`:

- `/public/assets/icons/` - Custom SVG icons
- `/public/assets/images/` - Images and photos
- `/public/assets/patterns/` - Pattern SVGs
- `/public/assets/branding/` - Logos and brand assets

Access via `staticFile()`:

```tsx
import { staticFile } from 'remotion';
<img src={staticFile('assets/images/hero.png')} />
```

## Example Composition

```tsx
import { AbsoluteFill, Sequence } from 'remotion';
import { Icon, BackgroundPattern, GlassCard, AnimatedGradient } from '../shared/assets';

export const MyScene: React.FC = () => {
  return (
    <AbsoluteFill>
      {/* Background layers */}
      <AnimatedGradient type="mesh" colors={["#0a0a1a", "#1a1a3e", "#0a0a1a"]} />
      <BackgroundPattern pattern="grid" opacity={0.15} animate />

      {/* Content */}
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
        <Sequence from={0}>
          <GlassCard animate width={600} padding={40}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
              <Icon name="speaker" size={80} animation="bounce" color="#3b82f6" />
              <div>
                <h1 style={{ margin: 0, fontSize: 48 }}>Audio Concepts</h1>
                <p style={{ margin: '10px 0 0', opacity: 0.7 }}>Understanding sound waves</p>
              </div>
            </div>
          </GlassCard>
        </Sequence>
      </div>
    </AbsoluteFill>
  );
};
```
