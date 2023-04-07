import logger from './utils/logger'
import app from './app'
import { connect } from './utils/database'

app.listen(app.get('port'), async () => {
  logger.info('App is running at http://localhost:%d', app.get('port'))

  await connect()
})
