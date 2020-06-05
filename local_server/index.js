let express = require('express')
let app = express()

app.listen(3001)

app.get('/api/user', (req, res) => {
    res.json({
        name: 'sk'
    })
})

