'use client';

import { useEffect, useRef, useState } from 'react';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import { motion, useScroll, useTransform } from 'framer-motion';

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

export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [currentSection, setCurrentSection] = useState(0);

  const { scrollXProgress } = useScroll({
    container: containerRef,
  });

  // 背景色渐变
  const backgroundColor = useTransform(
    scrollXProgress,
    [0, 0.33, 0.66, 1],
    [sections[0].color, sections[1].color, sections[2].color, sections[3].color]
  );

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
        className="h-full overflow-x-scroll overflow-y-hidden scroll-smooth"
        style={{ scrollSnapType: 'x mandatory' }}
      >
        <div className="flex h-full" style={{ width: `${sections.length * 100}vw` }}>
          {sections.map((section) => (
            <div
              key={section.id}
              className="flex-shrink-0 w-screen h-full relative"
              style={{ scrollSnapAlign: 'start' }}
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
            </div>
          ))}
        </div>
      </div>

      {/* 下半部分：Lottie动画（固定位置） */}
      <div className="fixed bottom-0 left-0 right-0 h-1/2 flex items-center justify-center pointer-events-none z-20">
        <div className="w-full max-w-lg" style={{ transform: 'scale(1.5)' }}>
          <DotLottieReact
            src="/walking-orange.lottie"
            loop
            autoplay
            className="w-full h-auto"
          />
        </div>
      </div>

      {/* 滚动提示指示器 */}
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 flex gap-2 z-10">
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
      </div>

      {/* 横向滚动提示 */}
      {currentSection === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 1 }}
          className="fixed top-8 right-8 flex items-center gap-2 text-sm italic"
          style={{ color: sections[0].textColor, opacity: 0.6 }}
        >
          <span>Scroll to explore</span>
          <motion.span
            animate={{ x: [0, 10, 0] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
          >
            →
          </motion.span>
        </motion.div>
      )}
    </motion.div>
  );
}
