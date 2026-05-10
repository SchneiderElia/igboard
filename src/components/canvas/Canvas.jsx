"use client";
import React, { useRef, useEffect, useState } from 'react';
import { DESIGN_MASTER_GRIDS } from '../../constants/design-master-grids';
import { ICON_LIBRARY } from '../../constants/design-composition-rules';

// ═══════════════════════════════════════════════════════════════
// ICON RENDERER
// Renderizza icone SVG come elementi decorativi posizionati
// in absolute. L'AI sceglie icona, posizione, size e opacity.
// ═══════════════════════════════════════════════════════════════
function IconRenderer({ icon, colors }) {
  if (!icon || !icon.name) return null;

  const iconData = ICON_LIBRARY[icon.name];
  if (!iconData) return null;

  const size = icon.size || 80;
  const opacity = icon.opacity || 0.15;
  const position = icon.position || 'top-right';

  // Mappa posizione → coordinate CSS
  const positionMap = {
    'top-left': { top: '60px', left: '60px' },
    'top-right': { top: '60px', right: '60px' },
    'bottom-left': { bottom: '80px', left: '60px' },
    'bottom-right': { bottom: '80px', right: '60px' },
    'center-left': { top: '50%', left: '60px', transform: 'translateY(-50%)' },
    'center-right': { top: '50%', right: '60px', transform: 'translateY(-50%)' },
  };

  const pos = positionMap[position] || positionMap['top-right'];

  return (
    <div style={{
      position: 'absolute',
      ...pos,
      zIndex: 0,
      opacity,
      width: `${size}px`,
      height: `${size}px`,
      pointerEvents: 'none',
    }}>
      <svg
        viewBox={iconData.viewBox}
        width={size}
        height={size}
        fill="none"
        stroke={colors.accent}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d={iconData.path} />
      </svg>
    </div>
  );
}


// ═══════════════════════════════════════════════════════════════
// DECORATOR RENDERER
// Elementi grafici posizionati in absolute che creano profondità
// visiva stile magazine (barre, blocchi, cornici, split bg).
// ═══════════════════════════════════════════════════════════════
function DecoratorRenderer({ decorators, colors }) {
  if (!decorators || decorators.length === 0) return null;

  return decorators.map((d, i) => {
    const baseStyle = {
      position: 'absolute',
      zIndex: d.zIndex || 0,
      pointerEvents: 'none',
    };

    switch (d.type) {
      // Barra orizzontale o verticale
      case 'bar':
        return (
          <div key={i} style={{
            ...baseStyle,
            backgroundColor: d.useAccent ? colors.accent : (d.color || colors.accent),
            opacity: d.opacity || 1,
            top: d.top || 'auto', bottom: d.bottom || 'auto',
            left: d.left || 'auto', right: d.right || 'auto',
            width: d.width || '100%', height: d.height || '8px',
          }} />
        );

      // Blocco rettangolare grande (crea ancora visivo)
      case 'block':
        return (
          <div key={i} style={{
            ...baseStyle,
            backgroundColor: d.useAccent ? colors.accent : (d.color || colors.accent),
            opacity: d.opacity || 0.15,
            top: d.top || '0', bottom: d.bottom || 'auto',
            left: d.left || '0', right: d.right || 'auto',
            width: d.width || '40%', height: d.height || '100%',
          }} />
        );

      // Cornice (bordo spesso attorno al canvas)
      case 'frame':
        return (
          <div key={i} style={{
            ...baseStyle,
            top: d.inset || '40px', bottom: d.inset || '40px',
            left: d.inset || '40px', right: d.inset || '40px',
            border: `${d.thickness || '6px'} solid ${d.useAccent ? colors.accent : (d.color || colors.accent)}`,
            opacity: d.opacity || 0.3,
          }} />
        );

      // Cerchio decorativo
      case 'circle':
        return (
          <div key={i} style={{
            ...baseStyle,
            backgroundColor: d.useAccent ? colors.accent : (d.color || colors.accent),
            opacity: d.opacity || 0.1,
            top: d.top || '50%', left: d.left || '50%',
            width: d.size || '400px', height: d.size || '400px',
            borderRadius: '50%',
            transform: 'translate(-50%, -50%)',
          }} />
        );

      // Background diviso (metà e metà)
      case 'splitBg':
        return (
          <div key={i} style={{
            ...baseStyle,
            top: 0, left: 0,
            width: d.splitAt || '40%', height: '100%',
            backgroundColor: d.color || colors.accent,
            opacity: d.opacity || 0.08,
          }} />
        );

      // Accento diagonale
      case 'diagonal':
        return (
          <div key={i} style={{
            ...baseStyle,
            top: 0, right: 0,
            width: '100%', height: '100%',
            background: `linear-gradient(${d.angle || '135deg'}, transparent ${d.splitAt || '60%'}, ${d.useAccent ? colors.accent : (d.color || colors.accent)} ${d.splitAt || '60%'})`,
            opacity: d.opacity || 0.08,
          }} />
        );

      // Testo decorativo (es: numero gigante, label, badge)
      case 'text':
        return (
          <div key={i} style={{
            ...baseStyle,
            color: d.useAccent ? colors.accent : (d.color || colors.accent),
            opacity: d.opacity || 1,
            top: d.top || 'auto', bottom: d.bottom || 'auto',
            left: d.left || 'auto', right: d.right || 'auto',
            fontSize: `${d.fontSize || 100}px`,
            fontWeight: d.fontWeight || 900,
            textTransform: d.textTransform || 'uppercase',
            letterSpacing: d.letterSpacing || '0em',
            rotate: `${d.rotate || 0}deg`,
            lineHeight: 1,
            fontFamily: d.fontFamily || 'inherit',
            whiteSpace: 'nowrap',
            writingMode: d.writingMode || 'horizontal-tb',
            mixBlendMode: d.mixBlendMode || 'normal',
          }}>
            {d.content}
          </div>
        );

      // Linee di griglia strutturali
      case 'gridLine':
        const isHorizontal = d.orientation === 'horizontal';
        return (
          <div key={i} style={{
            ...baseStyle,
            backgroundColor: d.useAccent ? colors.accent : (d.color || colors.accent),
            opacity: d.opacity || 0.1,
            top: isHorizontal ? (d.y || '50%') : 0,
            left: isHorizontal ? 0 : (d.x || '50%'),
            width: isHorizontal ? '100%' : (d.thickness || '1px'),
            height: isHorizontal ? (d.thickness || '1px') : '100%',
            mixBlendMode: d.mixBlendMode || 'normal',
          }} />
        );

      default:
        return null;
    }
  });
}

// ═══════════════════════════════════════════════════════════════
// ADAPTIVE FONT SYSTEM
// Floor minimi: headline mai sotto 40px, subheadline/subtitle mai sotto 18px
// ═══════════════════════════════════════════════════════════════
function adaptiveFontSize(text, baseSizePx, slotName) {
  const len = text?.length || 0;
  let scale = 1;
  if (len <= 15) scale = 1;
  else if (len <= 30) scale = 0.78;
  else if (len <= 50) scale = 0.62;
  else if (len <= 80) scale = 0.48;
  else if (len <= 120) scale = 0.38;
  else scale = 0.30;

  const scaled = baseSizePx * scale;

  // Floor: testi mai illeggibili
  const minSize = slotName === 'headline' ? 40 : 18;
  return Math.max(scaled, minSize);
}

// ═══════════════════════════════════════════════════════════════
// BODY RENDERER (con troncamento CSS)
// ═══════════════════════════════════════════════════════════════
function BodyText({ body, fontFamily, fontSize, fontWeight, textAlign, maxLines = 6 }) {
  const style = {
    fontFamily, fontWeight, textAlign,
    WebkitLineClamp: maxLines,
    display: '-webkit-box',
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden',
  };
  if (Array.isArray(body)) {
    return body.map((p, i) => (
      <p key={i} className="mb-3 leading-relaxed" style={{ ...style, fontSize }}>{p}</p>
    ));
  }
  return <p className="leading-relaxed" style={{ ...style, fontSize }}>{body}</p>;
}

// ═══════════════════════════════════════════════════════════════
// SLOT RENDERER (Renderizza un singolo slot: headline, sub, body, cta)
// ═══════════════════════════════════════════════════════════════
function SlotRenderer({ slot, content, slotConfig, colors, fontPair, slotName }) {
  if (!content || !slotConfig) return null;

  const baseFontSize = slotConfig.baseFontSize || 30;
  const adaptedSize = (slotName === 'headline' || slotName === 'subheadline' || slotName === 'subtitle')
    ? adaptiveFontSize(content, baseFontSize, slotName)
    : baseFontSize;

  // Text-wrap intelligente:
  // - headline: sempre 'balance' (equalizza le righe, regola 2/3 naturale)
  // - subheadline: 'pretty' (evita orfane, ultima riga ≥ 2/3)
  // - body: randomico tra 'pretty' e 'auto'
  const getTextWrap = () => {
    if (slotName === 'headline') return 'balance';
    if (slotName === 'subheadline' || slotName === 'subtitle') return 'pretty';
    return Math.random() > 0.5 ? 'pretty' : 'auto';
  };

  const style = {
    fontFamily: slotName === 'headline' ? fontPair.headline : fontPair.body,
    fontSize: `${adaptedSize}px`,
    fontWeight: slotConfig.fontWeight || 400,
    textAlign: slotConfig.align || 'left',
    textTransform: slotConfig.textTransform || 'none',
    letterSpacing: slotConfig.letterSpacing || 'normal',
    color: (slotName === 'headline' || slotName === 'cta') ? colors.accent : colors.text,
    opacity: slotConfig.opacity || 1,
    lineHeight: slotName === 'headline' ? 0.95 : 1.4,
    textWrap: getTextWrap(),
    // MAI spezzare parole a metà sillaba per headline/sub/cta
    wordBreak: (slotName === 'headline' || slotName === 'subheadline' || slotName === 'cta')
      ? 'normal'
      : 'normal',
    overflowWrap: (slotName === 'body') ? 'break-word' : 'normal',
    hyphens: 'none',
    maxWidth: slotConfig.maxWidth || '100%',
    flex: slotConfig.flex || '0 0 auto',
    transform: slotConfig.rotate ? `rotate(${slotConfig.rotate}deg)` : undefined,
    width: '100%',
    writingMode: slotConfig.writingMode || 'horizontal-tb',
    mixBlendMode: slotConfig.mixBlendMode || 'normal',
  };

  // Inversione colori per elementi come CTA punk
  if (slotConfig.invertColors) {
    style.backgroundColor = colors.accent;
    style.color = colors.bg;
    style.padding = '12px 24px';
    style.display = 'inline-block';
    style.width = 'auto';
  }

  // Border-left (stile Koto)
  if (slotConfig.borderLeft) {
    style.borderLeft = `8px solid ${colors.accent}`;
    style.paddingLeft = '24px';
  }

  // Top border per il body (stile Swiss)
  if (slotConfig.topBorder) {
    style.borderTop = `4px solid ${colors.accent}`;
    style.paddingTop = '24px';
  }

  if (slotName === 'body') {
    const totalLen = Array.isArray(content) ? content.join(' ').length : (content?.length || 0);
    const bodyFontSize = totalLen > 200 ? baseFontSize * 0.8 : baseFontSize;
    const maxLines = totalLen > 300 ? 4 : 8;
    return (
      <div style={{ maxWidth: slotConfig.maxWidth || '100%', flex: slotConfig.flex || '1 1 auto', width: '100%' }}>
        <BodyText
          body={content}
          fontFamily={fontPair.body}
          fontSize={`${bodyFontSize}px`}
          fontWeight={slotConfig.fontWeight || 400}
          textAlign={slotConfig.align || 'left'}
          maxLines={maxLines}
        />
      </div>
    );
  }

  if (slotName === 'headline') {
    return <h1 style={style}>{content}</h1>;
  }
  if (slotName === 'subheadline') {
    return <h2 style={style}>{content}</h2>;
  }
  if (slotName === 'subtitle') {
    return <p style={{ ...style, fontStyle: 'italic', opacity: style.opacity || 0.6 }}>{content}</p>;
  }
  return <span style={style}>{content}</span>;
}

// ═══════════════════════════════════════════════════════════════
// LAYOUT: COLUMN (Stack verticale naturale)
// ═══════════════════════════════════════════════════════════════
function ColumnLayout({ layout, content, colors, fontPair }) {
  const c = layout.container || {};
  const isReversed = c.reverse;

  // Ordine degli slot (il poster inverte: sub → body → headline in basso)
  const slots = isReversed
    ? ['subheadline', 'subtitle', 'cta', 'body', 'headline']
    : ['headline', 'subtitle', 'subheadline', 'body', 'cta'];

  return (
    <div
      className="w-full h-full flex flex-col"
      style={{
        padding: c.padding || '60px',
        justifyContent: c.justify || 'flex-start',
        alignItems: c.align || 'flex-start',
      }}
    >
      {/* Decoratore: Top Border (stile Swiss) */}
      {layout.topBorder && (
        <div className="w-full" style={{ borderTop: `8px solid ${colors.accent}`, paddingTop: '16px', flex: '0 0 auto' }} />
      )}

      {slots.map((slotName, index) => {
        const slotContent = content[slotName];
        if (!slotContent && slotName === 'cta') return null;
        if (!slotContent) return null;

        // Spaziature: headline → sub = 60px, sub → body = 90px, body items = 20px
        const isAfterHeadline = !isReversed && index > 0 && slots[0] === 'headline';
        let marginTop = '20px';
        if (index === 0) marginTop = '0';
        else if (isAfterHeadline && index === 1) marginTop = '60px';
        else if (slotName === 'body') marginTop = '90px';

        return (
          <div key={slotName} style={{ marginTop, width: '100%' }}>
            <SlotRenderer
              slotName={slotName}
              content={slotContent}
              slotConfig={layout[slotName] || { baseFontSize: 20, align: 'left', fontWeight: 400, opacity: 0.6 }}
              colors={colors}
              fontPair={fontPair}
            />
          </div>
        );
      })}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// LAYOUT: COVER (3 zone verticali: top / center / bottom)
// ═══════════════════════════════════════════════════════════════
function CoverLayout({ layout, content, colors, fontPair }) {
  const c = layout.container || {};
  const top = layout.topZone || {};
  const center = layout.centerZone || {};
  const bottom = layout.bottomZone || {};

  return (
    <div
      className="w-full h-full flex flex-col justify-between"
      style={{ padding: c.padding || '60px 80px' }}
    >
      {/* TOP ZONE: Subheadline */}
      <div className="flex w-full" style={{ justifyContent: top.justify || 'flex-end' }}>
        <SlotRenderer slotName="subheadline" content={content.subheadline} slotConfig={layout.subheadline} colors={colors} fontPair={fontPair} />
      </div>

      {/* CENTER ZONE: Headline (prende tutto lo spazio disponibile) */}
      <div className="flex-1 flex items-center" style={{ justifyContent: center.justify || 'center', padding: '20px 0' }}>
        <SlotRenderer slotName="headline" content={content.headline} slotConfig={layout.headline} colors={colors} fontPair={fontPair} />
      </div>

      {/* BOTTOM ZONE: Body + CTA */}
      <div
        className="flex w-full gap-8"
        style={{
          flexDirection: bottom.direction || 'row',
          justifyContent: bottom.justify || 'space-between',
          alignItems: bottom.align || 'flex-end',
        }}
      >
        <SlotRenderer slotName="body" content={content.body} slotConfig={layout.body} colors={colors} fontPair={fontPair} />
        {content.cta && (
          <SlotRenderer slotName="cta" content={content.cta} slotConfig={layout.cta} colors={colors} fontPair={fontPair} />
        )}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// LAYOUT: SPLIT (2 colonne affiancate)
// ═══════════════════════════════════════════════════════════════
function SplitLayout({ layout, content, colors, fontPair }) {
  const c = layout.container || {};
  const leftSlots = layout.leftContains || ['headline'];
  const rightSlots = layout.rightContains || ['subheadline', 'body', 'cta'];

  const renderSlots = (slots, align, justify) => (
    <div
      className="flex flex-col h-full"
      style={{
        gap: '20px',
        justifyContent: justify || 'flex-start',
        alignItems: align || 'flex-start',
      }}
    >
      {slots.map(slotName => {
        const slotContent = content[slotName];
        if (!slotContent && slotName === 'cta') return null;
        if (!slotContent) return null;
        return (
          <SlotRenderer
            key={slotName}
            slotName={slotName}
            content={slotContent}
            slotConfig={layout[slotName]}
            colors={colors}
            fontPair={fontPair}
          />
        );
      })}
    </div>
  );

  return (
    <div
      className="w-full h-full flex flex-row"
      style={{ padding: c.padding || '60px', gap: c.gap || '40px' }}
    >
      <div style={{ width: layout.leftWidth || '50%', borderRight: layout.divider ? `8px solid ${colors.accent}` : 'none', paddingRight: layout.divider ? '20px' : '0' }}>
        {renderSlots(leftSlots, layout.leftAlign, layout.leftJustify)}
      </div>
      <div style={{ width: layout.rightWidth || '50%', paddingLeft: layout.divider ? '20px' : '0' }}>
        {renderSlots(rightSlots, layout.rightAlign, layout.rightJustify)}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// LAYOUT: CENTERED (headline dominante, tutto centrato)
// ═══════════════════════════════════════════════════════════════
function CenteredLayout({ layout, content, colors, fontPair }) {
  const c = layout.container || {};

  return (
    <div
      className="w-full h-full flex flex-col items-center justify-between"
      style={{ padding: c.padding || '60px 80px', textAlign: 'center' }}
    >
      {/* ZONA ALTA: Respiro (vuoto intenzionale) */}
      <div style={{ flex: '0.5 0 0' }} />

      {/* ZONA CENTRALE: Headline + Subtitle + Subheadline — tutto centrato sull'asse */}
      <div className="flex flex-col items-center" style={{ width: '100%', gap: '20px' }}>
        <div style={{ maxWidth: layout.headline?.maxWidth || '90%', margin: '0 auto' }}>
          <SlotRenderer slotName="headline" content={content.headline} slotConfig={{ ...layout.headline, align: 'center', maxWidth: '100%' }} colors={colors} fontPair={fontPair} />
        </div>
        {content.subtitle && (
          <div style={{ maxWidth: '70%', margin: '0 auto' }}>
            <SlotRenderer slotName="subtitle" content={content.subtitle} slotConfig={{ baseFontSize: 20, align: 'center', fontWeight: 400, opacity: 0.5, maxWidth: '100%' }} colors={colors} fontPair={fontPair} />
          </div>
        )}
        <div style={{ maxWidth: layout.subheadline?.maxWidth || '75%', margin: '0 auto' }}>
          <SlotRenderer slotName="subheadline" content={content.subheadline} slotConfig={{ ...layout.subheadline, align: 'center', maxWidth: '100%' }} colors={colors} fontPair={fontPair} />
        </div>
      </div>

      {/* ZONA BASSA: Body + CTA centrati sull'asse */}
      <div className="flex flex-col items-center" style={{ paddingTop: '40px', gap: '16px', width: '100%' }}>
        {content.body && (
          <div style={{ maxWidth: layout.body?.maxWidth || '60%', margin: '0 auto' }}>
            <SlotRenderer slotName="body" content={content.body} slotConfig={{ ...layout.body, align: 'center', maxWidth: '100%' }} colors={colors} fontPair={fontPair} />
          </div>
        )}
        {content.cta && (
          <div style={{ margin: '0 auto' }}>
            <SlotRenderer slotName="cta" content={content.cta} slotConfig={{ ...layout.cta, align: 'center' }} colors={colors} fontPair={fontPair} />
          </div>
        )}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// LAYOUT: DYNAMIC CSS GRID (Motore AI v2)
// ═══════════════════════════════════════════════════════════════
function DynamicGridLayout({ layout, content, colors, fontPair }) {
  const { gridConfig = {}, positions = {}, decorators = [] } = layout;

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: `repeat(${gridConfig.columns || 12}, 1fr)`,
      gridTemplateRows: `repeat(${gridConfig.rows || 12}, 1fr)`,
      gap: gridConfig.gap || '20px',
      padding: gridConfig.padding || '60px',
      width: '100%',
      height: '100%',
      position: 'relative'
    }}>
      {/* 1. Render Decorators in background (using absolute positioning inside grid cells or spanning grid areas) */}
      {decorators && decorators.map((dec, i) => (
        <div key={`dec-${i}`} style={{
          gridArea: dec.gridArea,
          backgroundColor: dec.useAccent ? colors.accent : (dec.color || colors.accent),
          opacity: dec.opacity || 0.1,
          borderRadius: dec.type === 'circle' ? '50%' : '0'
        }} />
      ))}

      {/* 2. Render Text Content Mapped to Grid Areas */}
      {['headline', 'subheadline', 'subtitle', 'body', 'cta'].map(slotName => {
        const text = content[slotName];
        const pos = positions[slotName];

        if (!text || !pos || !pos.gridArea) return null;

        return (
          <div key={slotName} style={{
            gridArea: pos.gridArea,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: pos.justifyContent || 'flex-start',
            alignItems: pos.alignItems || 'flex-start',
            // Prevenire overflow del testo fuori dalla cella
            minWidth: 0, minHeight: 0
          }}>
            <SlotRenderer
              slotName={slotName}
              content={text}
              slotConfig={{
                ...pos,
                // Passa align al testo interno
                align: pos.textAlign || pos.alignItems === 'center' ? 'center' : pos.alignItems === 'flex-end' ? 'right' : 'left'
              }}
              colors={colors}
              fontPair={fontPair}
            />
          </div>
        );
      })}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// LAYOUT: ABSOLUTE ANCHOR (Motore AI Agent / Visual Cloning)
// ═══════════════════════════════════════════════════════════════
function AbsoluteAnchorLayout({ layout, content, colors, fontPair }) {
  const { anchorPoints = {}, decorators = [] } = layout;

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative' }}>
      {/* 1. Decorators in background */}
      {decorators && decorators.map((dec, i) => (
        <div key={`dec-${i}`} style={{
          position: 'absolute',
          top: dec.y || 0,
          left: dec.x || 0,
          width: dec.width || '100%',
          height: dec.height || '100%',
          backgroundColor: dec.useAccent ? colors.accent : (dec.color || colors.accent),
          opacity: dec.opacity || 0.1,
          borderRadius: dec.type === 'circle' ? '50%' : '0'
        }} />
      ))}

      {/* 2. Text Content on absolute anchors */}
      {['headline', 'subheadline', 'subtitle', 'body', 'cta'].map(slotName => {
        const text = content[slotName];
        const pos = anchorPoints[slotName];

        if (!text || !pos) return null;

        return (
          <div key={slotName} style={{
            position: 'absolute',
            top: pos.y || '0',
            left: pos.x || '0',
            width: pos.width || 'auto',
            display: 'flex',
            flexDirection: 'column',
            alignItems: pos.align === 'center' ? 'center' : pos.align === 'right' ? 'flex-end' : 'flex-start',
            rotate: `${pos.rotate || 0}deg`
          }}>
            <SlotRenderer
              slotName={slotName}
              content={text}
              slotConfig={{
                ...pos,
                baseFontSize: pos.fontSize || 30
              }}
              colors={colors}
              fontPair={fontPair}
            />
          </div>
        );
      })}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// ROUTER: Sceglie il renderer giusto in base al type
// ═══════════════════════════════════════════════════════════════
function LayoutRouter({ layout, content, colors, fontPair, templateId, isDynamic }) {
  const props = { layout, content, colors, fontPair, templateId };

  if (layout.style === 'VisualCloning') {
    return <AbsoluteAnchorLayout {...props} />;
  }

  if (isDynamic) {
    return <DynamicGridLayout {...props} />;
  }

  switch (layout.type) {
    case 'cover': return <CoverLayout {...props} />;
    case 'split': return <SplitLayout {...props} />;
    case 'centered': return <CenteredLayout {...props} />;
    case 'column':
    default: return <ColumnLayout {...props} />;
  }
}

// ═══════════════════════════════════════════════════════════════
// CANVAS (Componente Principale)
// ═══════════════════════════════════════════════════════════════
export default function Canvas({ design }) {
  const containerRef = useRef(null);
  const [scale, setScale] = useState(1);
  const [feedbackStatus, setFeedbackStatus] = useState('idle'); // 'idle' | 'sending' | 'saved'

  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        const availableWidth = window.innerWidth - 64;
        const availableHeight = window.innerHeight - 150;
        setScale(Math.min(availableWidth / 1080, availableHeight / 1350));
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);

    const handleWheel = (e) => {
      // Ignora scroll dentro UI (navbar, panel modelli, overlay)
      const uiZones = e.target.closest('nav, [data-ui-panel], .fixed');
      if (uiZones) return;

      if (e.ctrlKey || e.metaKey) e.preventDefault();
      const sens = e.ctrlKey ? 0.005 : 0.001;
      setScale(prev => Math.min(Math.max(0.1, prev - (e.deltaY * sens)), 5));
    };
    window.addEventListener('wheel', handleWheel, { passive: false });

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('wheel', handleWheel);
    };
  }, []);


  if (!design) return <div className="text-zinc-500">Incolla un testo e genera...</div>;

  const content = design.content || design || {};
  const colors = design.colors || { bg: '#000000', text: '#ffffff', accent: '#ffff00' };
  const designParams = design.designParams || { tension: 5, balance: 5, archetype: 'Magazine' };
  const fontConfig = design.fontConfig || { pair: 'Editorial' };
  const templateId = design.layoutTemplate || 'vogue_cover';

  const handleFeedback = async (type) => {
    setFeedbackStatus('sending');
    console.log(`[FEEDBACK] Tipo: ${type} per layout: ${templateId}`);

    // Simula salvataggio (verrà integrato con API evolution in futuro)
    setTimeout(() => {
      setFeedbackStatus('saved');
      setTimeout(() => setFeedbackStatus('idle'), 3000);
    }, 1200);
  };

  // Merge: template master + template evoluti (passati come prop o via _meta)
  const evolvedTemplates = design._evolvedTemplates || {};
  const ALL_GRIDS = { ...DESIGN_MASTER_GRIDS, ...evolvedTemplates };
  const layout = ALL_GRIDS[templateId] || DESIGN_MASTER_GRIDS['vogue_cover'];

  const FONT_PAIRS = {
    Editorial: {
      headline: "'Playfair Display', serif",
      body: "'Montserrat', sans-serif",
      googleQuery: 'Montserrat:wght@300;400&family=Playfair+Display:wght@700;900'
    },
    Brutalist: {
      headline: "'Syne', sans-serif",
      body: "'Space Mono', monospace",
      googleQuery: 'Space+Mono&family=Syne:wght@800'
    },
    Swiss: {
      headline: "'Inter', sans-serif",
      body: "'Inter', sans-serif",
      googleQuery: 'Inter:wght@400;900'
    },
    Minimal: {
      headline: "'Prata', serif",
      body: "'Lato', sans-serif",
      googleQuery: 'Lato:wght@300;400&family=Prata'
    },
    'Neo-Abstract': {
      headline: "'Archivo Black', sans-serif",
      body: "'Archivo', sans-serif",
      googleQuery: 'Archivo:wght@400&family=Archivo+Black'
    }
  };

  const fontPair = FONT_PAIRS[fontConfig.pair] || FONT_PAIRS.Editorial;

  return (
    <div ref={containerRef} className="w-full flex justify-center items-center p-4 overflow-hidden relative">
      <link rel="stylesheet" href={`https://fonts.googleapis.com/css2?family=${fontPair.googleQuery}&display=swap`} />

      {/* OVERLAY FEEDBACK (visibile solo se design dinamico) */}
      {design.isDynamic && (
        <div className="absolute top-8 right-8 z-50 flex gap-2">
          {feedbackStatus === 'saved' ? (
            <div className="bg-emerald-500 text-white px-4 py-2 rounded-full text-xs font-bold tracking-wider shadow-lg flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
              SALVATO
            </div>
          ) : feedbackStatus === 'sending' ? (
            <div className="bg-zinc-800 text-zinc-400 px-4 py-2 rounded-full text-xs font-bold tracking-wider shadow-lg animate-pulse">
              SALVATAGGIO...
            </div>
          ) : (
            <>
              <button
                onClick={() => handleFeedback('good')}
                className="bg-zinc-900/80 hover:bg-emerald-500/20 text-zinc-400 hover:text-emerald-400 hover:border-emerald-500/50 border border-zinc-700 backdrop-blur px-4 py-2 rounded-full text-xs font-bold tracking-wider shadow-lg transition-all flex items-center gap-2"
                title="Salva come Archetipo (Golden Grid)"
              >
                <span>⭐</span> PREFERITO
              </button>
              <button
                onClick={() => handleFeedback('bad')}
                className="bg-zinc-900/80 hover:bg-red-500/20 text-zinc-400 hover:text-red-400 hover:border-red-500/50 border border-zinc-700 backdrop-blur px-3 py-2 rounded-full text-xs font-bold shadow-lg transition-all"
                title="Scarta e invia feedback negativo"
              >
                <span>🗑️</span>
              </button>
            </>
          )}
        </div>
      )}

      <div style={{ width: 1080 * scale, height: 1350 * scale }} className="flex justify-center items-center">
        <div
          id="ig-canvas-capture"
          style={{
            width: '1080px',
            height: '1350px',
            backgroundColor: colors.bg,
            color: colors.text,
            transform: `scale(${scale})`,
            transformOrigin: 'center center',
          }}
          className="relative shadow-2xl overflow-hidden shrink-0"
        >
          {/* ALERT FUORI-SPEC: L'AI ha ignorato le istruzioni */}
          {design._meta?.outOfSpec && (
            <div className="absolute top-4 right-4 bg-orange-500 text-white py-2 px-5 rounded-full flex items-center gap-2 z-[99] shadow-lg text-sm font-bold uppercase tracking-wider">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
              Generazione Fuori Istruzioni
            </div>
          )}


          {/* DECORATORI GRAFICI (barre, blocchi, cornici, split — z-index 0) */}
          <DecoratorRenderer decorators={design.isDynamic ? design.decorators : layout.decorators} colors={colors} />

          {/* ICONA DI SUPPORTO (scelta dall'AI — z-index 0) */}
          <IconRenderer icon={design.icon} colors={colors} />

          {/* LAYOUT ROUTER o DYNAMIC RECONSTRUCTION (z-index 1) */}
          <div className="relative z-[1] w-full h-full">
            <LayoutRouter
              layout={design.isDynamic ? design : layout}
              content={content}
              colors={colors}
              fontPair={fontPair}
              templateId={templateId}
              isDynamic={design.isDynamic || templateId === 'dynamic'}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
