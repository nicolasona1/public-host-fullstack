import React from 'react';
import { Book, GraduationCap, DollarSign } from 'lucide-react';
import './Welcome.css'
function Welcome() {

  return (
    <div className="welcome-container">
      <main className="welcome-main">
        <section className="hero-section">
          <h2 className="welcome-title"><DollarSign className="welcome-icon" size={96}/></h2>
          <h1 className="welcome-title">Welcome to<br/>
          <span className='welcome-title'>SmartSpend</span> 
          </h1>
          <p className="welcome-tagline">
            A simple way to track your spending privately and responsibly.
          </p>
        </section>

        <section className="content-section">
          <h2 className="section-title"><Book className="section-icon" /> About This Tool</h2>
          <p className="section-paragraph">
            SmartSpend is designed to help college students like you take better control over their spending habits.
            Without needing to share any sensitive information, you can set budgets for each card and track how much
            you’ve spent.
          </p>
        </section>

        <section className="content-section">
          <h2 className="section-title">
            <GraduationCap className="section-icon" />
            Why I Built This
          </h2>
          <p className="section-paragraph">
            I know that many students depend on their parents financially, and often have to report how their money is
            being spent. This tool is a private and honest way to manage that. Whether it’s textbooks, groceries, or
            travel, SmartSpend helps you stay on top of your finances and share your progress without stress.
          </p>
        </section>
      </main>
    </div>
  );
}

export default Welcome;

