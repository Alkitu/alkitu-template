# PreviewImage - Alianza Molecule

Enhanced image preview component with lightbox, gallery mode, and download functionality.

## Features

### Core Functionality
- **Lightbox Modal**: Click thumbnail to open full-size image in modal
- **Gallery Mode**: Support for multiple images with navigation
- **Download Button**: Download images directly from lightbox
- **Keyboard Navigation**: ESC to close, arrow keys for gallery navigation
- **Focus Management**: Automatic focus trap in lightbox
- **Lazy Loading**: Built-in lazy loading support (can be disabled)

### Image Handling
- **Loading States**: Spinner with loading text
- **Error States**: Graceful error handling with icon
- **Placeholder**: Customizable placeholder when no image
- **Multiple Aspect Ratios**: 7 presets (square, 1:1, 4:3, 16:9, 3:2, 2:1, auto)
- **Custom Ratios**: Support for custom aspect ratios
- **Object Fit Modes**: cover, contain, fill, scale-down, none

### Styling Options
- **6 Size Variants**: xs, sm, md, lg, xl, 2xl
- **5 Border Radius Options**: none, sm, md, lg, full
- **Custom Styling**: className and style props support

### Accessibility
- **ARIA Labels**: Proper labels for all interactive elements
- **Keyboard Support**: Full keyboard navigation
- **Alt Text**: Mandatory alt text for images
- **Focus Management**: Automatic focus on close button
- **Screen Reader Support**: Proper role and aria attributes

## Usage

### Single Image with Lightbox
```tsx
<PreviewImage
  src="https://example.com/image.jpg"
  alt="Beautiful landscape"
  caption="Mountain landscape at sunset"
  aspectRatio="16:9"
  size="lg"
/>
```

### Gallery Mode
```tsx
<PreviewImage
  images={[
    { src: "img1.jpg", alt: "Image 1", caption: "Caption 1" },
    { src: "img2.jpg", alt: "Image 2", caption: "Caption 2" },
    { src: "img3.jpg", alt: "Image 3", caption: "Caption 3" }
  ]}
  aspectRatio="16:9"
  size="lg"
/>
```

### Preview Only (No Lightbox)
```tsx
<PreviewImage
  src="https://example.com/image.jpg"
  alt="Preview only"
  enableLightbox={false}
  aspectRatio="16:9"
  size="lg"
/>
```

### Without Download Button
```tsx
<PreviewImage
  src="https://example.com/image.jpg"
  alt="No download"
  showDownload={false}
/>
```

### Custom Placeholder
```tsx
<PreviewImage
  placeholder={<div>Custom Placeholder</div>}
  aspectRatio="square"
  size="lg"
/>
```

## Props

See `PreviewImage.types.ts` for complete prop definitions.

### Key Props
- `src`: Image source URL (single image mode)
- `images`: Array of images for gallery mode
- `alt`: Alternative text for accessibility
- `caption`: Caption shown in lightbox
- `aspectRatio`: Aspect ratio preset
- `size`: Size variant
- `radius`: Border radius variant
- `enableLightbox`: Enable/disable lightbox (default: true)
- `showDownload`: Show/hide download button (default: true)
- `loading`: Show loading state
- `onLightboxOpen`: Callback when lightbox opens
- `onLightboxClose`: Callback when lightbox closes
- `onDownload`: Callback when download is triggered

## Integration Points

### Dependencies
- **Button** (`@/components/molecules-alianza/Button`): Close, download, navigation buttons
- **Icon** (`@/components/atoms-alianza/Icon`): X, Download, ChevronLeft, ChevronRight, Image, ImageOff icons
- **Spinner** (`@/components/atoms-alianza/Spinner`): Loading state indicator

## Test Coverage

- **Total Tests**: 64 test cases across 18 test suites
- **Coverage**: 97.64% statement coverage
- **Test Categories**:
  - Rendering (4 tests)
  - Size Variants (7 tests)
  - Aspect Ratios (3 tests)
  - Loading States (3 tests)
  - Error States (3 tests)
  - Success States (2 tests)
  - Placeholder States (2 tests)
  - Lightbox Functionality (10 tests)
  - Gallery Mode (9 tests)
  - Caption Display (2 tests)
  - Download Functionality (3 tests)
  - Lazy Loading (2 tests)
  - Custom Styling (3 tests)
  - Accessibility (8 tests)
  - Edge Cases (5 tests)
  - Performance (2 tests)
  - Props Forwarding (3 tests)
  - Object Fit (5 tests)

## Storybook Stories

20 interactive stories demonstrating all features:
- Default
- With Caption
- Loading State
- Error State
- Custom Aspect Ratio
- Square Images
- Portrait Images
- Landscape Images
- Gallery Mode
- Gallery With Initial Index
- Without Lightbox
- Without Download
- All Sizes
- All Aspect Ratios
- Border Radius Variants
- Object Fit Modes
- Complex Gallery Example
- Custom Placeholder
- All States
- With Callbacks

## Keyboard Shortcuts

When lightbox is open:
- **ESC**: Close lightbox
- **Arrow Left**: Previous image (gallery mode)
- **Arrow Right**: Next image (gallery mode)
- **Enter/Space**: Open lightbox from thumbnail

## Migration from Standard

The Alianza PreviewImage adds the following features not present in the Standard version:
- ✅ Lightbox/modal functionality
- ✅ Gallery mode with multiple images
- ✅ Download functionality
- ✅ Keyboard navigation
- ✅ Focus management
- ✅ Caption support
- ✅ Navigation buttons in gallery
- ✅ Callbacks for lightbox events

All Standard features are preserved and enhanced.
