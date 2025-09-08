// Main application file
const { UserManager } = require('./user');
const api = require('./api');
const utils = require('./utils');

class Application {
  constructor() {
    this.userManager = new UserManager();
    this.config = {
      appName: 'Sample App',
      version: '1.0.0',
      environment: process.env.NODE_ENV || 'development'
    };
  }

  async initialize() {
    console.log(`Initializing ${this.config.appName} v${this.config.version}`);
    console.log(`Environment: ${this.config.environment}`);
    
    await this.loadConfiguration();
    this.setupEventHandlers();
    
    console.log('Application initialized successfully');
  }

  async loadConfiguration() {
    try {
      console.log('Loading configuration...');
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log('Configuration loaded');
    } catch (error) {
      console.error('Failed to load configuration:', error);
      throw error;
    }
  }

  setupEventHandlers() {
    console.log('Setting up event handlers...');
    
    process.on('SIGINT', () => {
      console.log('Shutting down gracefully...');
      this.shutdown();
    });
    
    process.on('uncaughtException', (error) => {
      console.error('Uncaught Exception:', error);
      this.shutdown(1);
    });
  }

  async run() {
    await this.initialize();
    
    console.log('Creating sample users...');
    const user1 = this.userManager.createUser('John Doe', 'john@example.com');
    const user2 = this.userManager.createUser('Jane Smith', 'jane@example.com');
    
    console.log('Users created:');
    console.log(user1.getFullInfo());
    console.log(user2.getFullInfo());
    
    console.log(`\nTotal users: ${this.userManager.getAllUsers().length}`);
    
    const formattedDate = utils.formatDate(new Date());
    console.log(`\nApplication running on ${formattedDate}`);
  }

  shutdown(exitCode = 0) {
    console.log('Cleaning up resources...');
    process.exit(exitCode);
  }
}

const app = new Application();

if (require.main === module) {
  app.run().catch(error => {
    console.error('Application failed to start:', error);
    process.exit(1);
  });
}

module.exports = Application;