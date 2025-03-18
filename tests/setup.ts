jest.mock('discord.js', () => {
  return {
    Client: jest.fn().mockImplementation(() => {
      return {
        login: jest.fn().mockResolvedValue('token'),
        on: jest.fn(),
        once: jest.fn(),
        user: { id: 'bot-user-id' },
        token: 'mock-token',
      };
    }),
    REST: jest.fn().mockImplementation(() => {
      return {
        setToken: jest.fn().mockReturnThis(),
        put: jest.fn().mockResolvedValue({}),
      };
    }),
    Routes: {
      applicationCommands: jest.fn().mockReturnValue('application-commands-route'),
    },
    GatewayIntentBits: { Guilds: 1 },
    Partials: { Channel: 1 },
    ActivityType: { Playing: 0 },
    ButtonStyle: {
      PRIMARY: 1,
      SECONDARY: 2,
      SUCCESS: 3,
      DANGER: 4,
      LINK: 5
    },
    ChannelType: { GUILD_TEXT: 0 },
    ApplicationCommandType: { 
      CHAT_INPUT: 1,
      USER: 2,
      MESSAGE: 3
    },
    ApplicationCommandOptionType: {
      STRING: 3,
      INTEGER: 4,
      BOOLEAN: 5,
      USER: 6,
      CHANNEL: 7,
      ROLE: 8,
      MENTIONABLE: 9,
      NUMBER: 10,
      ATTACHMENT: 11
    },
    MessageType: { DEFAULT: 0 },
    TextInputStyle: {
      SHORT: 1,
      PARAGRAPH: 2
    }
  };
});

beforeAll(() => {
  jest.spyOn(console, 'log').mockImplementation(() => {});
  jest.spyOn(console, 'warn').mockImplementation(() => {});
  jest.spyOn(console, 'error').mockImplementation(() => {});
});

afterAll(() => {
  jest.restoreAllMocks();
}); 