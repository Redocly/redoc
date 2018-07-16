import * as React from 'react';

import { RedocNormalizedOptions } from '../services/RedocNormalizedOptions';

export const OptionsContext = React.createContext(new RedocNormalizedOptions({}));
export const OptionsProvider = OptionsContext.Provider;
export const OptionsConsumer = OptionsContext.Consumer;
