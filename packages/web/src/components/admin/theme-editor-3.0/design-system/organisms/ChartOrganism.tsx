'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../primitives/card';
import { Button } from '../atoms/Button';
import { Badge } from '../atoms/Badge';
import { useThemeEditor } from '../../core/context/ThemeEditorContext';
import { 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  PieChart, 
  Pie, 
  Cell,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';
import { TrendingUp, TrendingDown, BarChart3, PieChartIcon, Activity, Download, Share2, RefreshCw } from 'lucide-react';

export interface ChartOrganismProps {
  variant?: 'area' | 'bar' | 'line' | 'pie' | 'mixed';
  showLegend?: boolean;
  showGrid?: boolean;
  showTooltip?: boolean;
  animated?: boolean;
  className?: string;
}

interface ChartDataPoint {
  name: string;
  value: number;
  revenue?: number;
  users?: number;
  growth?: number;
  color?: string;
}

const SAMPLE_DATA: ChartDataPoint[] = [
  { name: 'Jan', value: 400, revenue: 2400, users: 1200, growth: 5.2 },
  { name: 'Feb', value: 300, revenue: 1398, users: 980, growth: -1.3 },
  { name: 'Mar', value: 200, revenue: 9800, users: 1450, growth: 8.7 },
  { name: 'Apr', value: 278, revenue: 3908, users: 1890, growth: 12.1 },
  { name: 'May', value: 189, revenue: 4800, users: 2100, growth: 15.4 },
  { name: 'Jun', value: 239, revenue: 3800, users: 1950, growth: 6.8 }
];

const PIE_DATA: ChartDataPoint[] = [
  { name: 'Mobile', value: 45, color: '#8884d8' },
  { name: 'Desktop', value: 35, color: '#82ca9d' },
  { name: 'Tablet', value: 20, color: '#ffc658' }
];

/**
 * ChartOrganism - Complex chart component with theme integration
 * 
 * Combines: Recharts + Card + Button + Badge + Typography
 * Features: Multiple chart types, theme-responsive design, interactive controls
 * Spacing: Small (internal padding), Medium (component gaps), Large (section spacing)
 */
export function ChartOrganism({
  variant = 'area',
  showLegend = true,
  showGrid = true,
  showTooltip = true,
  animated = true,
  className = ''
}: ChartOrganismProps) {
  const { state } = useThemeEditor();
  const [isLoading, setIsLoading] = useState(false);
  const [timeRange, setTimeRange] = useState('6M');
  
  // Theme integration
  const colors = state.themeMode === 'dark' 
    ? state.currentTheme?.darkColors 
    : state.currentTheme?.lightColors;
  const shadows = state.currentTheme?.shadows;
  const spacing = state.currentTheme?.spacing;

  // Spacing system
  const baseSpacing = spacing?.spacing || '2.2rem';
  const baseValue = parseFloat(baseSpacing.replace('rem', '')) * 16;
  const smallSpacing = `var(--spacing-small, ${baseValue}px)`;
  const mediumSpacing = `var(--spacing-medium, ${baseValue * 2}px)`;

  const primaryColor = colors?.primary?.value || 'var(--color-primary)';
  const secondaryColor = colors?.secondary?.value || 'var(--color-secondary)';
  const accentColor = colors?.accent?.value || 'var(--color-accent)';

  const getChartColors = () => ({
    primary: primaryColor,
    secondary: secondaryColor,
    accent: accentColor,
    grid: colors?.border?.value || 'var(--color-border)',
    text: colors?.mutedForeground?.value || 'var(--color-muted-foreground)'
  });

  const chartColors = getChartColors();

  const refreshData = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  };

  const getVariantIcon = () => {
    switch (variant) {
      case 'area': return <Activity size={18} />;
      case 'bar': return <BarChart3 size={18} />;
      case 'line': return <TrendingUp size={18} />;
      case 'pie': return <PieChartIcon size={18} />;
      case 'mixed': return <BarChart3 size={18} />;
      default: return <Activity size={18} />;
    }
  };

  const getVariantName = () => {
    const names = {
      area: 'Area Chart',
      bar: 'Bar Chart',
      line: 'Line Chart',
      pie: 'Pie Chart',
      mixed: 'Mixed Chart'
    };
    return names[variant];
  };

  const renderAreaChart = () => (
    <ResponsiveContainer width="100%" height={300}>
      <AreaChart data={SAMPLE_DATA}>
        {showGrid && <CartesianGrid strokeDasharray="3 3" stroke={chartColors.grid} />}
        <XAxis 
          dataKey="name" 
          axisLine={false}
          tickLine={false}
          tick={{ fill: chartColors.text, fontSize: 12 }}
        />
        <YAxis 
          axisLine={false}
          tickLine={false}
          tick={{ fill: chartColors.text, fontSize: 12 }}
        />
        {showTooltip && (
          <Tooltip 
            contentStyle={{ 
              backgroundColor: colors?.card?.value || 'var(--color-card)',
              border: `1px solid ${colors?.border?.value || 'var(--color-border)'}`,
              borderRadius: '6px',
              color: colors?.foreground?.value || 'var(--color-foreground)'
            }}
          />
        )}
        {showLegend && <Legend />}
        <Area 
          type="monotone" 
          dataKey="value" 
          stroke={chartColors.primary}
          fill={`${chartColors.primary}20`}
          strokeWidth={2}
          dot={{ fill: chartColors.primary, strokeWidth: 2, r: 4 }}
        />
      </AreaChart>
    </ResponsiveContainer>
  );

  const renderBarChart = () => (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={SAMPLE_DATA}>
        {showGrid && <CartesianGrid strokeDasharray="3 3" stroke={chartColors.grid} />}
        <XAxis 
          dataKey="name" 
          axisLine={false}
          tickLine={false}
          tick={{ fill: chartColors.text, fontSize: 12 }}
        />
        <YAxis 
          axisLine={false}
          tickLine={false}
          tick={{ fill: chartColors.text, fontSize: 12 }}
        />
        {showTooltip && (
          <Tooltip 
            contentStyle={{ 
              backgroundColor: colors?.card?.value || 'var(--color-card)',
              border: `1px solid ${colors?.border?.value || 'var(--color-border)'}`,
              borderRadius: '6px',
              color: colors?.foreground?.value || 'var(--color-foreground)'
            }}
          />
        )}
        {showLegend && <Legend />}
        <Bar 
          dataKey="value" 
          fill={chartColors.primary}
          radius={[4, 4, 0, 0]}
        />
      </BarChart>
    </ResponsiveContainer>
  );

  const renderLineChart = () => (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={SAMPLE_DATA}>
        {showGrid && <CartesianGrid strokeDasharray="3 3" stroke={chartColors.grid} />}
        <XAxis 
          dataKey="name" 
          axisLine={false}
          tickLine={false}
          tick={{ fill: chartColors.text, fontSize: 12 }}
        />
        <YAxis 
          axisLine={false}
          tickLine={false}
          tick={{ fill: chartColors.text, fontSize: 12 }}
        />
        {showTooltip && (
          <Tooltip 
            contentStyle={{ 
              backgroundColor: colors?.card?.value || 'var(--color-card)',
              border: `1px solid ${colors?.border?.value || 'var(--color-border)'}`,
              borderRadius: '6px',
              color: colors?.foreground?.value || 'var(--color-foreground)'
            }}
          />
        )}
        {showLegend && <Legend />}
        <Line 
          type="monotone" 
          dataKey="value" 
          stroke={chartColors.primary}
          strokeWidth={3}
          dot={{ fill: chartColors.primary, strokeWidth: 2, r: 5 }}
          activeDot={{ r: 7, fill: chartColors.primary }}
        />
      </LineChart>
    </ResponsiveContainer>
  );

  const renderPieChart = () => (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={PIE_DATA}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
          outerRadius={80}
          fill={chartColors.primary}
          dataKey="value"
        >
          {PIE_DATA.map((entry, index) => (
            <Cell 
              key={`cell-${index}`} 
              fill={[chartColors.primary, chartColors.secondary, chartColors.accent][index % 3]} 
            />
          ))}
        </Pie>
        {showTooltip && (
          <Tooltip 
            contentStyle={{ 
              backgroundColor: colors?.card?.value || 'var(--color-card)',
              border: `1px solid ${colors?.border?.value || 'var(--color-border)'}`,
              borderRadius: '6px',
              color: colors?.foreground?.value || 'var(--color-foreground)'
            }}
          />
        )}
        {showLegend && <Legend />}
      </PieChart>
    </ResponsiveContainer>
  );

  const renderMixedChart = () => (
    <ResponsiveContainer width="100%" height={300}>
      <AreaChart data={SAMPLE_DATA}>
        {showGrid && <CartesianGrid strokeDasharray="3 3" stroke={chartColors.grid} />}
        <XAxis 
          dataKey="name" 
          axisLine={false}
          tickLine={false}
          tick={{ fill: chartColors.text, fontSize: 12 }}
        />
        <YAxis 
          axisLine={false}
          tickLine={false}
          tick={{ fill: chartColors.text, fontSize: 12 }}
        />
        {showTooltip && (
          <Tooltip 
            contentStyle={{ 
              backgroundColor: colors?.card?.value || 'var(--color-card)',
              border: `1px solid ${colors?.border?.value || 'var(--color-border)'}`,
              borderRadius: '6px',
              color: colors?.foreground?.value || 'var(--color-foreground)'
            }}
          />
        )}
        {showLegend && <Legend />}
        <Area 
          type="monotone" 
          dataKey="revenue" 
          stackId="1"
          stroke={chartColors.primary}
          fill={`${chartColors.primary}40`}
        />
        <Area 
          type="monotone" 
          dataKey="users" 
          stackId="1"
          stroke={chartColors.secondary}
          fill={`${chartColors.secondary}40`}
        />
      </AreaChart>
    </ResponsiveContainer>
  );

  const renderChart = () => {
    if (isLoading) {
      return (
        <div 
          className="w-full h-[300px] flex items-center justify-center"
          style={{ 
            background: `${colors?.accent?.value || 'var(--color-accent)'}10`,
            borderRadius: 'var(--radius-card, 8px)'
          }}
        >
          <div className="flex items-center gap-3">
            <RefreshCw 
              size={20} 
              className="animate-spin"
              style={{ color: colors?.primary?.value || 'var(--color-primary)' }}
            />
            <span 
              className="text-sm"
              style={{ color: colors?.mutedForeground?.value || 'var(--color-muted-foreground)' }}
            >
              Loading chart data...
            </span>
          </div>
        </div>
      );
    }

    switch (variant) {
      case 'bar': return renderBarChart();
      case 'line': return renderLineChart();
      case 'pie': return renderPieChart();
      case 'mixed': return renderMixedChart();
      case 'area':
      default: return renderAreaChart();
    }
  };

  const calculateGrowth = () => {
    const currentValue = SAMPLE_DATA[SAMPLE_DATA.length - 1]?.value || 0;
    const previousValue = SAMPLE_DATA[SAMPLE_DATA.length - 2]?.value || 0;
    const growth = ((currentValue - previousValue) / previousValue * 100);
    return growth;
  };

  const growth = calculateGrowth();
  const isPositiveGrowth = growth >= 0;

  return (
    <Card 
      className={`w-full ${className}`}
      style={{
        background: `${colors?.card?.value || 'var(--color-card)'}`,
        border: `1px solid ${colors?.border?.value || 'var(--color-border)'}`,
        boxShadow: shadows?.shadowMd || 'var(--shadow-md)'
      }}
    >
      {/* Header */}
      <CardHeader style={{ padding: mediumSpacing }}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div 
              className="w-10 h-10 rounded-lg flex items-center justify-center"
              style={{
                background: `${colors?.primary?.value || 'var(--color-primary)'}20`,
                color: colors?.primary?.value || 'var(--color-primary)'
              }}
            >
              {getVariantIcon()}
            </div>
            <div>
              <CardTitle 
                style={{ 
                  color: colors?.foreground?.value || 'var(--color-foreground)',
                  fontFamily: 'var(--typography-h3-font-family)',
                  fontSize: 'var(--typography-h3-font-size)',
                  marginBottom: '4px'
                }}
              >
                {getVariantName()}
              </CardTitle>
              <CardDescription 
                style={{ 
                  color: colors?.mutedForeground?.value || 'var(--color-muted-foreground)',
                  fontSize: '14px'
                }}
              >
                Analytics dashboard for the last {timeRange.toLowerCase()}
              </CardDescription>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Badge 
              variant="outline"
              style={{
                background: isPositiveGrowth ? '#22c55e20' : '#ef444420',
                borderColor: isPositiveGrowth ? '#22c55e' : '#ef4444',
                color: isPositiveGrowth ? '#22c55e' : '#ef4444'
              }}
            >
              <div className="flex items-center gap-1">
                {isPositiveGrowth ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                {Math.abs(growth).toFixed(1)}%
              </div>
            </Badge>
            
            {/* Time Range Selector */}
            <div className="flex gap-1">
              {['1M', '3M', '6M', '1Y'].map((range) => (
                <Button
                  key={range}
                  size="sm"
                  variant={timeRange === range ? 'default' : 'ghost'}
                  className="text-xs px-2"
                  onClick={() => setTimeRange(range)}
                  style={{
                    background: timeRange === range ? 
                      (colors?.primary?.value || 'var(--color-primary)') : 
                      'transparent',
                    color: timeRange === range ?
                      (colors?.primaryForeground?.value || 'var(--color-primary-foreground)') :
                      (colors?.mutedForeground?.value || 'var(--color-muted-foreground)')
                  }}
                >
                  {range}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </CardHeader>

      {/* Chart Content */}
      <CardContent style={{ padding: `0 ${mediumSpacing} ${mediumSpacing}` }}>
        {renderChart()}
      </CardContent>

      {/* Footer */}
      <CardFooter 
        className="flex items-center justify-between"
        style={{ padding: mediumSpacing, paddingTop: 0 }}
      >
        <div className="flex items-center gap-4">
          <div className="text-center">
            <p 
              className="text-2xl font-bold"
              style={{ color: colors?.foreground?.value || 'var(--color-foreground)' }}
            >
              {SAMPLE_DATA[SAMPLE_DATA.length - 1]?.value || 0}
            </p>
            <p 
              className="text-xs"
              style={{ color: colors?.mutedForeground?.value || 'var(--color-muted-foreground)' }}
            >
              Current Value
            </p>
          </div>
          
          <div className="text-center">
            <p 
              className="text-lg font-semibold"
              style={{ color: colors?.foreground?.value || 'var(--color-foreground)' }}
            >
              {SAMPLE_DATA.reduce((sum, item) => sum + item.value, 0)}
            </p>
            <p 
              className="text-xs"
              style={{ color: colors?.mutedForeground?.value || 'var(--color-muted-foreground)' }}
            >
              Total
            </p>
          </div>
        </div>
        
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={refreshData}
            disabled={isLoading}
            style={{
              color: colors?.mutedForeground?.value || 'var(--color-muted-foreground)'
            }}
          >
            <RefreshCw size={14} className={isLoading ? 'animate-spin' : ''} />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            style={{
              color: colors?.mutedForeground?.value || 'var(--color-muted-foreground)'
            }}
          >
            <Share2 size={14} />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            style={{
              color: colors?.mutedForeground?.value || 'var(--color-muted-foreground)'
            }}
          >
            <Download size={14} />
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}

/**
 * ChartOrganismShowcase - Demo component showing different chart variants
 */
export function ChartOrganismShowcase() {
  const { state } = useThemeEditor();
  
  const colors = state.themeMode === 'dark' 
    ? state.currentTheme?.darkColors 
    : state.currentTheme?.lightColors;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full">
      <ChartOrganism variant="area" />
      <ChartOrganism variant="bar" />
      <ChartOrganism variant="line" />
      <ChartOrganism variant="pie" />
      <div className="lg:col-span-2">
        <ChartOrganism variant="mixed" />
      </div>
    </div>
  );
}