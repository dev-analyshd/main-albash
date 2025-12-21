// Runtime stubs for ethers contract factories.
// This file exists so browser/server bundlers can resolve imports
// when full web3 support is disabled in the development environment.

export const AlbashNFT__factory = {
  connect: (..._args: any[]) => {
    // Return a minimal stub object to avoid runtime crashes.
    return {
      safeMint: async () => {
        throw new Error('AlbashNFT__factory.safeMint is not available in this environment');
      },
    };
  },
};

export const AlbashToken__factory = {
  connect: (..._args: any[]) => {
    return {
      // token methods stub
    };
  },
};

export default {};
