const { Actor, HttpAgent } = require('@dfinity/agent');
const { Principal } = require('@dfinity/principal');

// Define the canister interface (IDL)
const idlFactory = ({ IDL }) => {
  const Message = IDL.Record({
    sender: IDL.Text,
    receiver: IDL.Text,
    content: IDL.Text,
    timestamp: IDL.Int,
  });

  return IDL.Service({
    sendMessage: IDL.Func([IDL.Text, IDL.Text, IDL.Text], [IDL.Bool], []),
    receiveMessages: IDL.Func([IDL.Text], [IDL.Vec(Message)], ['query']),
    editMessage: IDL.Func([IDL.Text, IDL.Nat, IDL.Text], [IDL.Bool], []),
    deleteUserMessages: IDL.Func([IDL.Text], [IDL.Bool], []),
    clearMessages: IDL.Func([], [IDL.Bool], []),
    harassmentLevel: IDL.Func([IDL.Text], [IDL.Text], []),
    suggestImprovedMessage: IDL.Func([IDL.Text], [IDL.Text], []),
    validateKey: IDL.Func([IDL.Text, IDL.Text], [IDL.Bool], []),
  });
};

class ICMessagingClient {
  constructor(canisterId = 'usxsn-hyaaa-aaaad-aapxq-cai', options = {}) {
    this.canisterId = canisterId;
    this.host = options.host || 'https://icp-api.io';
    this.agent = null;
    this.actor = null;
    this.isLocal = options.isLocal || false;
    this.isAuthorized = false;
    this.authorizedProject = null;
    this.authorizedKey = null;
  }

  async initialize() {
    try {
      // Create HTTP agent
      this.agent = new HttpAgent({
        host: this.host,
      });

      // For local development, disable certificate verification
      if (this.isLocal) {
        await this.agent.fetchRootKey();
      }

      // Create actor
      this.actor = Actor.createActor(idlFactory, {
        agent: this.agent,
        canisterId: this.canisterId,
      });

      console.log('IC Messaging Client initialized successfully');
      return true;
    } catch (error) {
      console.error('Failed to initialize IC Messaging Client:', error);
      throw error;
    }
  }

  async authorize(project, key) {
    if (!this.actor) {
      throw new Error('Client not initialized. Call initialize() first.');
    }

    try {
      const isValid = await this.actor.validateKey(project, key);
      
      if (isValid) {
        this.isAuthorized = true;
        this.authorizedProject = project;
        this.authorizedKey = key;
        console.log(`✅ Authorization successful for project: ${project}`);
        return true;
      } else {
        this.isAuthorized = false;
        this.authorizedProject = null;
        this.authorizedKey = null;
        console.log(`❌ Authorization failed for project: ${project}`);
        return false;
      }
    } catch (error) {
      console.error('Error during authorization:', error);
      throw error;
    }
  }

  _checkAuthorization() {
    if (!this.isAuthorized) {
      throw new Error('Not authorized. Please call authorize(project, key) first with valid credentials.');
    }
  }

  async sendMessage(sender, receiver, content) {
    if (!this.actor) {
      throw new Error('Client not initialized. Call initialize() first.');
    }
    this._checkAuthorization();

    try {
      const result = await this.actor.sendMessage(sender, receiver, content);
      return result;
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  }

  async receiveMessages(userPrincipal) {
    if (!this.actor) {
      throw new Error('Client not initialized. Call initialize() first.');
    }
    this._checkAuthorization();

    try {
      const messages = await this.actor.receiveMessages(userPrincipal);
      return messages.map(msg => ({
        sender: msg.sender,
        receiver: msg.receiver,
        content: msg.content,
        timestamp: Number(msg.timestamp),
      }));
    } catch (error) {
      console.error('Error receiving messages:', error);
      throw error;
    }
  }

  async editMessage(address, index, newContent) {
    if (!this.actor) {
      throw new Error('Client not initialized. Call initialize() first.');
    }
    this._checkAuthorization();

    try {
      const result = await this.actor.editMessage(address, index, newContent);
      return result;
    } catch (error) {
      console.error('Error editing message:', error);
      throw error;
    }
  }

  async deleteUserMessages(address) {
    if (!this.actor) {
      throw new Error('Client not initialized. Call initialize() first.');
    }
    this._checkAuthorization();

    try {
      const result = await this.actor.deleteUserMessages(address);
      return result;
    } catch (error) {
      console.error('Error deleting user messages:', error);
      throw error;
    }
  }

  async clearMessages() {
    if (!this.actor) {
      throw new Error('Client not initialized. Call initialize() first.');
    }
    this._checkAuthorization();

    try {
      const result = await this.actor.clearMessages();
      return result;
    } catch (error) {
      console.error('Error clearing messages:', error);
      throw error;
    }
  }

  async harassmentLevel(content) {
    if (!this.actor) {
      throw new Error('Client not initialized. Call initialize() first.');
    }
    this._checkAuthorization();

    try {
      const result = await this.actor.harassmentLevel(content);
      return result;
    } catch (error) {
      console.error('Error checking harassment level:', error);
      throw error;
    }
  }

  async suggestImprovedMessage(content) {
    if (!this.actor) {
      throw new Error('Client not initialized. Call initialize() first.');
    }
    this._checkAuthorization();

    try {
      const result = await this.actor.suggestImprovedMessage(content);
      return result;
    } catch (error) {
      console.error('Error suggesting improved message:', error);
      throw error;
    }
  }

  async validateKey(project, input) {
    if (!this.actor) {
      throw new Error('Client not initialized. Call initialize() first.');
    }
    // Note: validateKey is the only method that doesn't require authorization
    // since it's used for authorization itself

    try {
      const result = await this.actor.validateKey(project, input);
      return result;
    } catch (error) {
      console.error('Error validating key:', error);
      throw error;
    }
  }

  // Utility method to get canister status
  async getCanisterStatus() {
    if (!this.agent) {
      throw new Error('Client not initialized. Call initialize() first.');
    }

    try {
      const status = await this.agent.status();
      return status;
    } catch (error) {
      console.error('Error getting canister status:', error);
      throw error;
    }
  }
}

module.exports = ICMessagingClient;

// Example usage:
/*
const ICMessagingClient = require('./index.js');

async function example() {
  const client = new ICMessagingClient();
  
  try {
    // Step 1: Initialize the client
    await client.initialize();
    
    // Step 2: Authorize with project name and key
    const authorized = await client.authorize('machu', 'machu-1750486429293560682');
    if (!authorized) {
      console.log('Authorization failed!');
      return;
    }
    
    // Step 3: Now you can use all other functions
    const success = await client.sendMessage(
      'elsnu-exgt6-a6c4w-zvlfc-3oqrj-5ifj3-adiil-cagsu-sdtml-yeed7-mae',
      'xraya-wv56e-7ddrm-fwhih-wx6er-3tiru-agv3f-efbkp-uwqbn-od643-rae',
      'Hello, how are you?'
    );
    console.log('Message sent:', success);
    
    // Receive messages
    const messages = await client.receiveMessages('xraya-wv56e-7ddrm-fwhih-wx6er-3tiru-agv3f-efbkp-uwqbn-od643-rae');
    console.log('Received messages:', messages);
    
    // Check harassment level
    const level = await client.harassmentLevel('This is a test message');
    console.log('Harassment level:', level);
    
    // Suggest improved message
    const improved = await client.suggestImprovedMessage('This is a rude message');
    console.log('Improved message:', improved);
    
  } catch (error) {
    console.error('Error in example:', error);
  }
}

// Uncomment to run example
// example();
*/