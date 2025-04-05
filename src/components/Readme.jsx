import { useState, useEffect } from 'react';

const Readme = () => {
  const [activeSection, setActiveSection] = useState(null);
  const [showBackToTop, setShowBackToTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const sections = document.querySelectorAll('section');
      const scrollPosition = window.scrollY + 100;

      sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
          setActiveSection(section.id);
        }
      });

      setShowBackToTop(window.scrollY > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen w-full bg-black relative">
      {/* Section Navigation */}
      <div className="fixed top-32 right-4 z-30 hidden md:block">
        <div className="bg-black/80 backdrop-blur-sm rounded-lg p-4 border border-white/10">
          <ul className="space-y-2">
            <li>
              <button 
                onClick={() => scrollToSection('welcome')}
                className={`text-sm ${activeSection === 'welcome' ? 'text-amber-400' : 'text-white/70 hover:text-white'}`}
              >
                Welcome
              </button>
            </li>
            <li>
              <button 
                onClick={() => scrollToSection('steps')}
                className={`text-sm ${activeSection === 'steps' ? 'text-amber-400' : 'text-white/70 hover:text-white'}`}
              >
                Steps of Creation
              </button>
            </li>
            <li>
              <button 
                onClick={() => scrollToSection('principles')}
                className={`text-sm ${activeSection === 'principles' ? 'text-amber-400' : 'text-white/70 hover:text-white'}`}
              >
                Core Principles
              </button>
            </li>
          </ul>
        </div>
      </div>

      {/* Back to Top Button */}
      <button 
        className={`back-to-top ${showBackToTop ? 'visible' : ''}`}
        onClick={scrollToTop}
      >
        ↑ Back to Top
      </button>

      <div className="max-w-4xl mx-auto px-4 py-8 readme-content" style={{ paddingTop: '6rem' }}>
        <section id="welcome" className="mb-20">
          <h1>Welcome to Your Inspirational Media Collection</h1>
          
          <div className="section-card">
            <p className="text-xl">This space is dedicated to <strong>inspiring and reminding you of the incredible creator that you are</strong>. The media you find here isn't just for passive viewing—it's a catalyst for consciously shaping your reality and <strong>re-membering Who You Really Are</strong>.</p>
            
            <blockquote>
              "Life is a process of creation, not discovery."
            </blockquote>
          </div>
        </section>

        <section id="steps" className="mb-20">
          <h2>The 10 Steps of Creation</h2>

          <div className="space-y-8">
            {[
              {
                title: "1. You Are Created in the Image of the Creator",
                content: "As a divine being, you possess the same creative power as the Creator. This collection serves as a tool to empower that creative force within you."
              },
              {
                title: "2. The Three-Part Being",
                content: "You are a trinity: mind, body, and spirit (or superconscious, conscious, subconscious)."
              },
              {
                title: "3. The Three Tools of Creation",
                content: (
                  <ul className="list-none space-y-2">
                    <li><strong>Thought</strong> (Proceeds from the Father) - What you think creates at one level</li>
                    <li><strong>Word</strong> ("Ask and you shall receive, speak and it shall be done unto you") - What you think and speak creates at another level</li>
                    <li><strong>Deed</strong> ("And the Word was made flesh, and dwelt among us") - What you think, speak, and do becomes manifest in your reality</li>
                  </ul>
                )
              },
              {
                title: "4. The Power Levels of Creation",
                content: "The three tools work at different power levels, building upon each other to manifest your reality."
              },
              {
                title: "5. Belief Is Essential",
                content: "To truly create, you must KNOW, not just hope. This is absolute faith—knowing with certainty that it is already done."
              },
              {
                title: "6. Gratitude in Advance",
                content: "Be thankful BEFORE the manifestation. This 'taking for granted' is the mark of a Master—knowing in advance that the deed has been done."
              },
              {
                title: "7. Own All Your Creations",
                content: "Celebrate and enjoy ALL that you create. To reject any part is to reject a part of yourself."
              },
              {
                title: "8. Choose Again",
                content: "If you don't enjoy an aspect of your creation, simply change it. Choose again. Think a new thought. Say a new word. Do a new thing."
              },
              {
                title: "9. Your Life Takes Off When You:",
                content: (
                  <ul className="list-none space-y-2">
                    <li>Become VERY CLEAR about what you want</li>
                    <li>Think about NOTHING ELSE</li>
                    <li>Imagine NO OTHER POSSIBILITIES</li>
                    <li>Throw out ALL negative thoughts</li>
                    <li>Lose ALL pessimism</li>
                    <li>Release ALL doubts</li>
                    <li>Reject ALL fears</li>
                    <li>Hold fast to your original creative thought</li>
                  </ul>
                )
              },
              {
                title: "10. The Power of 'I AM'",
                content: (
                  <ul className="list-none space-y-2">
                    <li><span className="i-am">"I am"</span> is the strongest creative statement in the universe</li>
                    <li>Whatever follows <span className="i-am">"I am"</span> sets into motion those experiences</li>
                    <li>The universe responds to <span className="i-am">"I am"</span> as a genie to a command</li>
                  </ul>
                )
              }
            ].map((step, index) => (
              <div key={index} className="section-card">
                <h3>{step.title}</h3>
                {typeof step.content === 'string' ? <p>{step.content}</p> : step.content}
              </div>
            ))}
          </div>
        </section>

        <section id="principles" className="mb-20">
          <h2>Core Principles for Engaging with This Collection</h2>

          <div className="space-y-8">
            {[
              {
                title: "The Creative Power of 'I AM'",
                content: <p><span className="i-am">"I am"</span> is the strongest creative statement in the universe. Whatever follows <span className="i-am">"I am"</span> sets into motion those experiences. Be mindful of these powerful words as you engage with inspirational content.</p>
              },
              {
                title: "Listen to Your Inner Wisdom",
                content: "Pay attention to your <strong>feelings, your Highest Thoughts, and your experience</strong>. These are your truest guides. Let this media help you tune into that inner voice."
              },
              {
                title: "Gratitude as a Creative Force",
                content: "Practice <strong>being grateful before, and for, the creation</strong>. This 'thankfulness in advance' acknowledges what you desire is already present. Use the media here to cultivate this attitude."
              }
            ].map((principle, index) => (
              <div key={index} className="section-card">
                <h3>{principle.title}</h3>
                {principle.content}
              </div>
            ))}
          </div>
        </section>

        <section className="mb-12">
          <div className="section-card">
            <p className="text-xl">Consider your relationship with this inspirational media as an <strong>opportunity, not an obligation</strong>—an opportunity for growth, for full Self expression, for lifting your life to its highest potential, and for a deeper connection with the Divine within you.</p>
            
            <p className="text-xl mt-4">Use this collection as a sacred space for <strong>conscious creation and joyful re-membering.</strong></p>
            
            <p className="text-xl mt-8 italic">Enjoy the journey!</p>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Readme; 