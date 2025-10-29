'use client';

import { useEffect, useRef, useState } from 'react';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import { motion, useScroll, useTransform } from 'framer-motion';
import Lenis from 'lenis';

// 章节定义
const sections = [
  {
    id: 1,
    title: 'We Are All Oranges',
    text: 'Grey skies overhead\nYet we walk, step after step\nTogether, we breathe',
    color: '#FBF8EF',
    textColor: '#666666',
  },
  {
    id: 2,
    title: 'A Brighter Dawn',
    text: 'Soft morning whispers\nWarmth spreads through weathered branches\nSmall joys start to bloom',
    color: '#80CBC4',
    textColor: '#2C5F5A',
  },
  {
    id: 3,
    title: 'Blooming Days',
    text: 'Laughter like sunshine\nHearts dance lighter than before\nSweet moments linger',
    color: '#B4EBE6',
    textColor: '#1A6B63',
  },
  {
    id: 4,
    title: 'Golden Tomorrow',
    text: 'Golden paths unfold\nEvery soul walks free and bright\nPeace glows from within',
    color: '#FFB433',
    textColor: '#8B5A00',
  },
];

const designerNote = `When I close my eyes and imagine the future, I don't see flying cars or towering cities. I see people walking—slowly, peacefully, without rush. This project is for everyone who feels trapped in the relentless pace of modern life, everyone who dreams of a world where we can finally breathe.

I chose oranges as the central metaphor because they represent something beautifully ordinary. We are all oranges—simple, sweet, and meant to exist without pressure. In a world that constantly demands productivity and perfection, I wanted to remind us that we're allowed to just be.

The horizontal scroll breaks the endless vertical feeds we're so used to. Instead of scrolling mindlessly downward, you move sideways, deliberately, like taking steps on a journey. Each section is a breath, a pause.

I started with grey—not harsh black, but a soft, tired grey—because that's where many of us are now. Then the colors gradually bloom: teal for the first whispers of hope, aqua for joy beginning to spread, and finally golden for a future where everyone glows with inner peace.

This design is my love letter to a gentler future—one where we're not constantly running, but simply walking, together, toward light.`;

export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [currentSection, setCurrentSection] = useState(0);

  const { scrollXProgress } = useScroll({
    container: containerRef,
  });

  // 背景色渐变
  // 0-20%: 第1页, 20-40%: 第2页, 40-60%: 第3页, 60-80%: 第4页, 80-100%: Designer's Note
  const backgroundColor = useTransform(
    scrollXProgress,
    [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.85, 1],
    [
      sections[0].color,  // 0%: 第1页开始
      sections[0].color,  // 10%: 第1页中心
      sections[1].color,  // 20%: 过渡到第2页
      sections[1].color,  // 30%: 第2页中心
      sections[2].color,  // 40%: 过渡到第3页
      sections[2].color,  // 50%: 第3页中心
      sections[3].color,  // 60%: 过渡到第4页
      sections[3].color,  // 70%: 第4页中心
      sections[3].color,  // 80%: 保持第4页颜色
      '#FFFFFF',          // 85%: 开始渐变到白色
      '#FFFFFF'           // 100%: Designer's Note纯白
    ]
  );

  // Lottie和其他元素的透明度（在80%后开始淡出）
  const elementsOpacity = useTransform(scrollXProgress, [0.75, 0.9], [1, 0]);

  // Designer's Note的透明度（在85%后开始淡入）
  const noteOpacity = useTransform(scrollXProgress, [0.85, 0.95], [0, 1]);

  // 滚动提示的透明度（基于elementsOpacity计算）
  const scrollHintOpacity = useTransform(elementsOpacity, [0, 1], [0, 0.6]);

  // 初始化Lenis平滑滚动
  useEffect(() => {
    const lenis = new Lenis({
      wrapper: containerRef.current!,
      orientation: 'horizontal',
      smoothWheel: true,
      smoothTouch: true,
      duration: 1.5,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      lerp: 0.1,
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);

  // 监听滚动进度更新当前章节
  useEffect(() => {
    const unsubscribe = scrollXProgress.on('change', (latest) => {
      const newSection = Math.min(
        Math.floor(latest * sections.length),
        sections.length - 1
      );
      setCurrentSection(newSection);
    });

    return () => unsubscribe();
  }, [scrollXProgress]);

  return (
    <motion.div
      className="fixed inset-0 overflow-hidden"
      style={{ backgroundColor }}
    >
      {/* 横向滚动容器 */}
      <div
        ref={containerRef}
        className="h-full overflow-x-scroll overflow-y-hidden"
      >
        <div className="flex h-full" style={{ width: '500vw' }}>
          {sections.map((section) => (
            <motion.div
              key={section.id}
              className="flex-shrink-0 w-screen h-full relative"
              style={{ opacity: elementsOpacity }}
            >
              {/* 上半部分：文字内容 */}
              <div className="absolute top-0 left-0 right-0 h-1/2 flex items-center justify-center px-12">
                <motion.div
                  initial={{ opacity: 0, x: 100 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  className="text-center max-w-4xl"
                >
                  <h1
                    className="font-serif italic mb-6"
                    style={{
                      fontSize: 'clamp(2.5rem, 6vw, 5rem)',
                      color: section.textColor,
                      fontWeight: 300,
                      letterSpacing: '0.02em',
                      lineHeight: 1.2,
                    }}
                  >
                    {section.title}
                  </h1>
                  <p
                    className="font-serif italic whitespace-pre-line"
                    style={{
                      fontSize: 'clamp(1rem, 2vw, 1.5rem)',
                      color: section.textColor,
                      opacity: 0.8,
                      fontWeight: 300,
                      lineHeight: 1.8,
                    }}
                  >
                    {section.text}
                  </p>
                </motion.div>
              </div>
            </motion.div>
          ))}

          {/* Designer's Note - 第5个独立页面 */}
          <div className="flex-shrink-0 w-screen h-full relative flex items-center justify-center px-16">
            <motion.div
              className="max-w-3xl"
              style={{ opacity: noteOpacity }}
            >
              <h2
                className="font-serif italic mb-8 text-center"
                style={{
                  fontSize: 'clamp(2rem, 4vw, 3rem)',
                  color: '#8B5A00',
                  fontWeight: 300,
                  letterSpacing: '0.08em',
                }}
              >
                Designer's Note
              </h2>
              <div
                className="font-serif whitespace-pre-line text-left leading-relaxed"
                style={{
                  fontSize: 'clamp(0.95rem, 1.2vw, 1.1rem)',
                  color: '#666666',
                  fontWeight: 300,
                  lineHeight: 2,
                  letterSpacing: '0.01em',
                }}
              >
                {designerNote}
              </div>
              <div
                className="mt-12 text-right font-serif italic"
                style={{
                  fontSize: 'clamp(0.9rem, 1.1vw, 1rem)',
                  color: '#999999',
                  fontWeight: 300,
                }}
              >
                — With hope
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* 下半部分：Lottie动画（固定位置，会淡出） */}
      <motion.div
        className="fixed bottom-0 left-0 right-0 h-1/2 flex items-center justify-center pointer-events-none z-20"
        style={{ opacity: elementsOpacity }}
      >
        <div className="w-full max-w-lg" style={{ transform: 'scale(1.5)' }}>
          <DotLottieReact
            src="/walking-orange.lottie"
            loop
            autoplay
            className="w-full h-auto"
          />
        </div>
      </motion.div>

      {/* 滚动提示指示器（会淡出） */}
      <motion.div
        className="fixed bottom-8 left-1/2 -translate-x-1/2 flex gap-2 z-10"
        style={{ opacity: elementsOpacity }}
      >
        {sections.map((_, index) => (
          <div
            key={index}
            className="w-2 h-2 rounded-full transition-all duration-300"
            style={{
              backgroundColor: currentSection === index
                ? sections[currentSection].textColor
                : 'rgba(0,0,0,0.2)',
              transform: currentSection === index ? 'scale(1.5)' : 'scale(1)',
            }}
          />
        ))}
      </motion.div>

      {/* 横向滚动提示（会淡出） */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: currentSection === 0 ? 1 : 0 }}
        transition={{ delay: 1, duration: 1 }}
        className="fixed top-8 right-8 flex items-center gap-2 text-sm italic pointer-events-none"
        style={{
          color: sections[0].textColor,
          opacity: scrollHintOpacity
        }}
      >
        <span>Scroll to explore</span>
        <motion.span
          animate={{ x: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
        >
          →
        </motion.span>
      </motion.div>
    </motion.div>
  );
}
