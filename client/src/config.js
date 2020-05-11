const config = {
  dev: {},
};

const stage = process.env.REACT_APP_STAGE || 'dev';

export default config[stage];
