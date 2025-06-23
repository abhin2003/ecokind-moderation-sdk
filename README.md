# EcoKind Moderation SDK

https://www.npmjs.com/package/ecokind-moderation-sdk

EcoKind is a privacy-first content moderation SDK powered by decentralized LLMs on the Internet Computer. This package enables real-time toxic message detection with built-in AI tools, ensuring safer communication across digital platforms.

> ⚠️ **Note:** Only **authorized users** with a valid project key can access and utilize the SDK's moderation features.  
> 🔑 You can request an authorization key from [https://ecokind.xyz](https://ecokind.xyz).


## Features

- **Real-time content moderation** - Instant analysis of messages as they're sent
- **Privacy-preserving AI** - Powered by decentralized LLMs on the Internet Computer
- **Easy integration** - Simple API for existing messaging systems
- **Toxicity detection** - Advanced harassment detection with severity levels
- **Message improvement** - AI-powered suggestions for better communication
- **Secure authorization** - Project key validation required for all features
- **Developer-friendly** - Full JSDoc and TypeScript support

## Installation

```bash
npm install ecokind-moderation-sdk
```

## Quick Start

```javascript
const EcoKindClient = require('ecokind-moderation-sdk');

async function main() {
  const client = new EcoKindClient();
  await client.initialize();

  // Set the authorized project key
  await client.authorize('myproject', 'myproject-abc123');

  const message = 'You are so dumb!';
  
  const level = await client.harassmentLevel(message);
  console.log('Harassment Level:', level);

  const improved = await client.suggestImprovedMessage(message);
  console.log('Suggested Improvement:', improved);
}

main().catch(console.error);
```

## API Reference

### Constructor

```javascript
const client = new EcoKindClient(canisterId, options);
```

**Parameters:**
- `canisterId` (optional): The canister ID. Defaults to your deployed canister
- `options` (optional): Configuration options
  - `host`: IC network host (default: 'https://icp0.io')
  - `isLocal`: Set to true for local development (default: false)

### Methods

#### `initialize()`

Initializes the connection to the Internet Computer canister.

```javascript
await client.initialize();
```

#### `authorize(project, key)`

Authorizes the SDK usage for a given project. **Required before using any core feature.**

```javascript
await client.authorize('myproject', 'myproject-abc123');
```

**Returns:** `Boolean` - true if authorization is successful

#### `sendMessage(sender, receiver, content)`

Sends a message with automatic harassment detection. Authorization required.

```javascript
const success = await client.sendMessage('user1', 'user2', 'Hello!');
```

**Returns:** `Boolean` - true if message was sent successfully

#### `receiveMessages(userPrincipal)`

Retrieves all messages for a specific user. Authorization required.

```javascript
const messages = await client.receiveMessages('user1');
```

**Returns:** `Array<Message>` - Array of message objects

#### `editMessage(address, index, newContent)`

Edits a message at the specified index (only by the original sender). Authorization required.

```javascript
const edited = await client.editMessage('user1', 0, 'Updated message');
```

**Returns:** `Boolean` - true if edit was successful

#### `deleteUserMessages(address)`

Deletes all messages sent by a specific user. Authorization required.

```javascript
const deleted = await client.deleteUserMessages('user1');
```

**Returns:** `Boolean` - true if deletion was successful

#### `clearMessages()`

Clears all messages from the system. Authorization required.

```javascript
const cleared = await client.clearMessages();
```

**Returns:** `Boolean` - true if clearing was successful

#### `harassmentLevel(content)`

Analyzes the harassment level of a message. Authorization required.

```javascript
const level = await client.harassmentLevel('This is a test message');
// Returns: 'Low', 'Moderate', or 'High'
```

**Returns:** `String` - Harassment level classification

#### `suggestImprovedMessage(content)`

Gets an AI-improved version of a message. Authorization required.

```javascript
const improved = await client.suggestImprovedMessage('ur dumb');
// Returns: A more polite version of the message
```

**Returns:** `String` - Improved message content

#### `validateKey(project, input)`

Validates a project key format.

```javascript
const isValid = await client.validateKey('myproject', 'myproject-abc123');
```

**Returns:** `Boolean` - true if key format is valid

### Message Object Structure

```javascript
{
  sender: "user1-address",
  receiver: "user2-address", 
  content: "Hello there!",
  timestamp: 1640995200000
}
```

## Error Handling

All methods throw errors that should be caught, especially if the user is not authorized.

```javascript
try {
  const success = await client.sendMessage('user1', 'user2', 'Hello!');
} catch (error) {
  console.error('Failed to send message:', error);
}
```

## Local Development

For local development with a local Internet Computer replica:

```javascript
const client = new EcoKindClient('your-local-canister-id', {
  host: 'http://localhost:8000',
  isLocal: true
});
```

Don't forget to use your local project's key for authorization:

```javascript
await client.authorize('localproject', 'localproject-xyz456');
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support and questions:

- Open an issue on GitHub
- Check the [Internet Computer documentation](https://internetcomputer.org/docs/)
- Visit the [DFINITY community forums](https://forum.dfinity.org/)

---

**Built with ❤️ on the Internet Computer**