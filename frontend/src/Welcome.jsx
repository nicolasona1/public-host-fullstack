import React from 'react';


function Welcome({onGetStarted}) {
  return (
    <div className="welcome-container">
      <h1>Welcome to SmartSpend</h1>
      <p className="tagline">A simple way to track your spending — privately and responsibly.</p>

      <div className="about-section">
        <h2>📘 About This Tool</h2>
        <p>
          SmartSpend is designed to help college students like you take better control over their spending habits.
          Without needing to share any sensitive information, you can set budgets for each card and track how much you’ve spent.
        </p>
      </div>

      <div className="mission-section">
        <h2>🎓 Why I Built This</h2>
        <p>
          I know that many students depend on their parents financially, and often have to report how their money is being spent.
          This tool is a private and honest way to manage that. Whether it’s textbooks, groceries, or travel, SmartSpend helps you stay on top of your finances and share your progress without stress.
        </p>
      </div>
    </div>
  );
}

export default Welcome;
