'use client';

import Image from 'next/image';
import Link from 'next/link';

export default function Home() {
  return (
    <>
      <header className="header">
        <div className="header_content">
          <Link href="/" className="logo">
            <Image 
              src="/images/logo.jpg" 
              alt="LearnXchange Logo" 
              className="img_logo"
              width={100}
              height={100}
            />
            <h1>LearnXchange</h1>
          </Link>

          <nav className="nav">
            <div className="navi">
              <Link href="#home" className="nav_content">Home</Link>
              <Link href="#features" className="nav_content">Features</Link>
              <Link href="#pricing" className="nav_content">Pricing</Link>
              <Link href="#blog" className="nav_content">Blog</Link>
              <Link href="#about" className="nav_content">About</Link>
            </div>
          </nav>

          <Link href="/signup" className="contact_button">Sign-up</Link>

          <button className="sidebar" aria-label="Toggle Menu">
            <Image 
              src="/images/logo.jpg" 
              alt="Menu Icon" 
              className="menu_icon"
              width={30}
              height={30}
            />
          </button>
        </div>
      </header>

      <main className="hero-section">
        <section className="hero-sec-content">
          <div className="left-box">
            <p className="left-box-p">Very proud to introduce</p>
            <h1 className="hero_sec_heading">Seamless Learning for Brighter Future</h1>
            <p className="heading-p">Our innovative platform offers an effortless and seamless approach to learning, empowering youths of all ages to achieve a brighter future. Join us on a transformative journey to unlock your true potential with the help of our experts.</p>
            <div className="button_group">
              <button className="hero_button1">Start now</button>
              <button className="hero_button2">Take tour</button>
            </div>
          </div>
          <div className="right-box">
            <Image 
              src="/images/hero.jpg" 
              alt="Learning Illustration" 
              className="hero_sec_img"
              width={440}
              height={440}
            />
          </div>
        </section>

        <div className="feature_container">
          <div className="feature_content">
            <div className="feature_des">
              <h2 className="feature_heading">
                Our Competitive Advantage
              </h2>
              <p>
                We provide a great panel of analysts who are fully determined in providing the quality knowledge to the learners and ensure that they will get best output from us.
              </p>
            </div>
            <div className="feature_card">
              <div className="card1">
                <div className="card1_icon">
                  <Image 
                    src="/images/card1.jpg" 
                    alt="Personalized Learning" 
                    id="card1_icon"
                    width={50}
                    height={50}
                  />
                </div>
                <div className="card1_des">
                  <h3 className="feature_heading">Personalized Learning</h3>
                  <p>Offer tailored learning experiences through digital machines and techniques to cater to individual learner needs.</p>
                </div>
              </div>

              <div className="card2">
                <div className="card1_icon">
                  <Image 
                    src="/images/card2.jpg" 
                    alt="Affordability" 
                    id="card1_icon"
                    width={50}
                    height={50}
                  />
                </div>
                <div className="card1_des">
                  <h3 className="feature_heading">Affordability</h3>
                  <p>Offer tailored learning experiences through digital machines and techniques to cater to individual learner needs.</p>
                </div>
              </div>

              <div className="card3">
                <div className="card1_icon">
                  <Image 
                    src="/images/card3.jpg" 
                    alt="Industry Partnerships" 
                    id="card1_icon"
                    width={50}
                    height={50}
                  />
                </div>
                <div className="card1_des">
                  <h3 className="feature_heading">Industry Partnerships</h3>
                  <p>Offer tailored learning experiences through digital machines and techniques to cater to individual learner needs.</p>
                </div>
              </div>

              <div className="card4">
                <div className="card1_icon">
                  <Image 
                    src="/images/card4.jpg" 
                    alt="Innovative Technology" 
                    id="card1_icon"
                    width={50}
                    height={50}
                  />
                </div>
                <div className="card1_des">
                  <h3 className="feature_heading">Innovative Technology</h3>
                  <p>Offer tailored learning experiences through digital machines and techniques to cater to individual learner needs.</p>
                </div>
              </div>

              <div className="card5">
                <div className="card1_icon">
                  <Image 
                    src="/images/card5.jpg" 
                    alt="Responsive Support" 
                    id="card1_icon"
                    width={50}
                    height={50}
                  />
                </div>
                <div className="card1_des">
                  <h3 className="feature_heading">Responsive Support</h3>
                  <p>Offer tailored learning experiences through digital machines and techniques to cater to individual learner needs.</p>
                </div>
              </div>

              <div className="card6">
                <div className="card1_icon">
                  <Image 
                    src="/images/graph.avif" 
                    alt="Analytics and Insights" 
                    id="card1_icon"
                    width={50}
                    height={50}
                  />
                </div>
                <div className="card1_des">
                  <h3 className="feature_heading">Analytics and Insights</h3>
                  <p>Offer tailored learning experiences through digital machines and techniques to cater to individual learner needs.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
} 