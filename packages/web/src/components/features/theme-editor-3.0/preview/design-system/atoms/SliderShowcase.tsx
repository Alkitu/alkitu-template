'use client';

import React, { useState } from 'react';
import { ShowcaseContainer } from './ShowcaseContainer';
import { Slider } from '@/components/atoms-alianza/Slider';

/**
 * Slider Showcase Component
 * Demonstrates all Slider atom variants and configurations
 */
export function SliderShowcase() {
  const [basicValue, setBasicValue] = useState(25);
  const [rangeValue, setRangeValue] = useState(75);
  const [verticalValue, setVerticalValue] = useState(40);
  const [interactiveValue, setInteractiveValue] = useState(60);

  return (
    <div className="space-y-6">
      
      {/* Basic Sliders */}
      <ShowcaseContainer name="Basic Sliders" tokenId="basic-sliders">
        <div className="space-y-6 w-full">
          <div>
            <p className="text-xs text-muted-foreground mb-3">Default</p>
            <Slider
              value={basicValue}
              onChange={setBasicValue}
              aria-label="Basic slider"
            />
          </div>
          
          <div>
            <p className="text-xs text-muted-foreground mb-3">With Value Label</p>
            <Slider
              value={rangeValue}
              onChange={setRangeValue}
              showValue
              aria-label="Slider with value"
            />
          </div>
        </div>
      </ShowcaseContainer>

      {/* Sizes */}
      <ShowcaseContainer name="Sizes" tokenId="slider-sizes">
        <div className="space-y-6 w-full">
          <div>
            <p className="text-xs text-muted-foreground mb-3">Small</p>
            <Slider
              size="sm"
              defaultValue={30}
              showValue
              aria-label="Small slider"
            />
          </div>
          
          <div>
            <p className="text-xs text-muted-foreground mb-3">Medium (default)</p>
            <Slider
              size="md"
              defaultValue={50}
              showValue
              aria-label="Medium slider"
            />
          </div>
          
          <div>
            <p className="text-xs text-muted-foreground mb-3">Large</p>
            <Slider
              size="lg"
              defaultValue={70}
              showValue
              aria-label="Large slider"
            />
          </div>
        </div>
      </ShowcaseContainer>

      {/* Color Variants */}
      <ShowcaseContainer name="Color Variants" tokenId="color-variants">
        <div className="space-y-6 w-full">
          <div>
            <p className="text-xs text-muted-foreground mb-3">Default</p>
            <Slider
              variant="default"
              defaultValue={40}
              showValue
              aria-label="Default slider"
            />
          </div>
          
          <div>
            <p className="text-xs text-muted-foreground mb-3">Primary</p>
            <Slider
              variant="primary"
              defaultValue={60}
              showValue
              aria-label="Primary slider"
            />
          </div>
          
          <div>
            <p className="text-xs text-muted-foreground mb-3">Secondary</p>
            <Slider
              variant="secondary"
              defaultValue={80}
              showValue
              aria-label="Secondary slider"
            />
          </div>
        </div>
      </ShowcaseContainer>

      {/* With Tick Marks */}
      <ShowcaseContainer name="With Tick Marks" tokenId="tick-marks">
        <div className="space-y-6 w-full">
          <div>
            <p className="text-xs text-muted-foreground mb-3">Auto Ticks</p>
            <Slider
              defaultValue={50}
              showTicks
              showValue
              aria-label="Slider with auto ticks"
            />
          </div>
          
          <div>
            <p className="text-xs text-muted-foreground mb-3">Custom Ticks</p>
            <Slider
              defaultValue={25}
              min={0}
              max={100}
              step={5}
              ticks={[0, 25, 50, 75, 100]}
              showTicks
              showValue
              aria-label="Slider with custom ticks"
            />
          </div>
        </div>
      </ShowcaseContainer>

      {/* Value Label Positions */}
      <ShowcaseContainer name="Value Label Positions" tokenId="label-positions">
        <div className="space-y-6 w-full">
          <div>
            <p className="text-xs text-muted-foreground mb-3">Top (default)</p>
            <Slider
              defaultValue={30}
              showValue
              labelPosition="top"
              aria-label="Top label slider"
            />
          </div>
          
          <div>
            <p className="text-xs text-muted-foreground mb-3">Bottom</p>
            <Slider
              defaultValue={50}
              showValue
              labelPosition="bottom"
              aria-label="Bottom label slider"
            />
          </div>
          
          <div className="flex items-center gap-4">
            <div>
              <p className="text-xs text-muted-foreground mb-3">Left</p>
              <Slider
                defaultValue={70}
                showValue
                labelPosition="left"
                size="sm"
                aria-label="Left label slider"
              />
            </div>
            
            <div>
              <p className="text-xs text-muted-foreground mb-3">Right</p>
              <Slider
                defaultValue={40}
                showValue
                labelPosition="right"
                size="sm"
                aria-label="Right label slider"
              />
            </div>
          </div>
        </div>
      </ShowcaseContainer>

      {/* Range and Steps */}
      <ShowcaseContainer name="Range and Steps" tokenId="range-steps">
        <div className="space-y-6 w-full">
          <div>
            <p className="text-xs text-muted-foreground mb-3">Custom Range (0-200)</p>
            <Slider
              min={0}
              max={200}
              step={10}
              defaultValue={80}
              showValue
              aria-label="Custom range slider"
            />
          </div>
          
          <div>
            <p className="text-xs text-muted-foreground mb-3">Small Steps (0-1)</p>
            <Slider
              min={0}
              max={1}
              step={0.1}
              defaultValue={0.3}
              showValue
              aria-label="Small steps slider"
            />
          </div>
          
          <div>
            <p className="text-xs text-muted-foreground mb-3">Large Steps (0-1000)</p>
            <Slider
              min={0}
              max={1000}
              step={50}
              defaultValue={250}
              showValue
              showTicks
              aria-label="Large steps slider"
            />
          </div>
        </div>
      </ShowcaseContainer>

      {/* Vertical Sliders */}
      <ShowcaseContainer name="Vertical Sliders" tokenId="vertical-sliders">
        <div className="flex items-center justify-center gap-8 py-8">
          <div className="text-center">
            <p className="text-xs text-muted-foreground mb-3">Small</p>
            <Slider
              orientation="vertical"
              size="sm"
              defaultValue={30}
              showValue
              labelPosition="bottom"
              aria-label="Small vertical slider"
            />
          </div>
          
          <div className="text-center">
            <p className="text-xs text-muted-foreground mb-3">Medium</p>
            <Slider
              orientation="vertical"
              size="md"
              value={verticalValue}
              onChange={setVerticalValue}
              showValue
              labelPosition="bottom"
              variant="primary"
              aria-label="Medium vertical slider"
            />
          </div>
          
          <div className="text-center">
            <p className="text-xs text-muted-foreground mb-3">Large</p>
            <Slider
              orientation="vertical"
              size="lg"
              defaultValue={70}
              showValue
              labelPosition="bottom"
              showTicks
              aria-label="Large vertical slider"
            />
          </div>
          
          <div className="text-center">
            <p className="text-xs text-muted-foreground mb-3">With Ticks</p>
            <Slider
              orientation="vertical"
              defaultValue={60}
              showTicks
              ticks={[0, 25, 50, 75, 100]}
              showValue
              labelPosition="bottom"
              variant="secondary"
              aria-label="Vertical slider with ticks"
            />
          </div>
        </div>
      </ShowcaseContainer>

      {/* States */}
      <ShowcaseContainer name="States" tokenId="slider-states">
        <div className="space-y-6 w-full">
          <div>
            <p className="text-xs text-muted-foreground mb-3">Normal</p>
            <Slider
              value={interactiveValue}
              onChange={setInteractiveValue}
              showValue
              aria-label="Normal slider"
            />
          </div>
          
          <div>
            <p className="text-xs text-muted-foreground mb-3">Disabled</p>
            <Slider
              defaultValue={45}
              disabled
              showValue
              aria-label="Disabled slider"
            />
          </div>
        </div>
      </ShowcaseContainer>

      {/* Real World Usage */}
      <ShowcaseContainer name="Real World Usage" tokenId="real-world-usage">
        <div className="space-y-8 w-full">
          {/* Volume Control */}
          <div>
            <p className="text-xs text-muted-foreground mb-3">Volume Control</p>
            <div className="flex items-center gap-3">
              <span className="text-sm text-muted-foreground min-w-[60px]">Volume:</span>
              <Slider
                min={0}
                max={100}
                step={5}
                defaultValue={65}
                showValue
                variant="primary"
                size="sm"
                aria-label="Volume control"
              />
            </div>
          </div>

          {/* Brightness Control */}
          <div>
            <p className="text-xs text-muted-foreground mb-3">Brightness Control</p>
            <div className="flex items-center gap-3">
              <span className="text-sm text-muted-foreground min-w-[60px]">Brightness:</span>
              <Slider
                min={10}
                max={100}
                step={10}
                defaultValue={80}
                showValue
                showTicks
                ticks={[10, 25, 50, 75, 100]}
                aria-label="Brightness control"
              />
            </div>
          </div>

          {/* Price Range */}
          <div>
            <p className="text-xs text-muted-foreground mb-3">Price Filter</p>
            <div className="flex items-center gap-3">
              <span className="text-sm text-muted-foreground min-w-[60px]">Max Price:</span>
              <Slider
                min={0}
                max={1000}
                step={50}
                defaultValue={300}
                showValue
                variant="secondary"
                aria-label="Price filter"
              />
              <span className="text-sm text-muted-foreground">USD</span>
            </div>
          </div>

          {/* Temperature */}
          <div>
            <p className="text-xs text-muted-foreground mb-3">Temperature Control</p>
            <div className="flex items-center gap-3">
              <span className="text-sm text-muted-foreground min-w-[60px]">Temp:</span>
              <Slider
                min={16}
                max={30}
                step={0.5}
                defaultValue={22}
                showValue
                showTicks
                ticks={[16, 18, 20, 22, 24, 26, 28, 30]}
                variant="primary"
                aria-label="Temperature control"
              />
              <span className="text-sm text-muted-foreground">°C</span>
            </div>
          </div>
        </div>
      </ShowcaseContainer>

    </div>
  );
}

export default SliderShowcase;