'use strict';

import sig from './sig/index';

export default app => {
	app.use('/sig', sig);
};