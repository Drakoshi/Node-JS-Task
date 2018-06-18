var express = require('express');
var router = express.Router();
var fs = require('fs');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Simple Messages!' });
});

// ID to message, from JSON file
router.post('/receive',function(req,res,next){
  var fileName = 'post.json'; // Future, Send in from elsewhere

  // Probably needs some error handling
  // logically thinking the ID will be always there and there is not found case in line 31
  fs.readFile(fileName, (err,data) =>{
    var content = [];
    content = JSON.parse(data);
    console.log(content);
    
    var tmpid = req.body.id;
    var tmpmsg;

    // find message in array
    for(i in content){
      if(content[i].ID == tmpid)
        tmpmsg = content[i].Message; 
    }
    // If no match was found in array
    if(tmpmsg == null)
      tmpmsg = 'There is no message associated with that ID';

    res.render('receive', {id: tmpid,msg : tmpmsg});
  });
})

// Message and ID to JSON file
router.post('/send', function(req,res,next) {
  // get variables from form
  //var id = req.body.id; // Future, the ID should be generated 
  var id = 0;
  var msg = req.body.msg;

  // Write to file
  WriteToFile(msg, function(pID){
    id = pID;
    console.log(id);

    // Render success message
    res.render('sent', {id: id,msg : msg});
  });
})

// Returns ID
function WriteToFile(msg, mCallback){
  var fileName = 'post.json'; // Future, Send in from elsewhere
  var content = [] 
  id = 1;
  fs.readFile(fileName, (err,data) =>{
    try {
      content = JSON.parse(data);
      console.log('lenght',content.length);

      id = content.length + 1;
      console.log(id);
      //else
        //id = 0  
    }
    catch(err){
      if(err.code == 'ENOENT') // If the file doesn't exist, create one 
        fs.writeFile(fileName,JSON.stringify(content),(err)=>{
          if(err == null){
            console.log('success', id);
          }
          // Handle errors
        });
    }
    
    var tmp = {
      ID: id,
      Message: msg
    };
    content.push(tmp);

    fs.writeFile(fileName, JSON.stringify(content),(err)=>{
      if(err == null){
        console.log('success');
        mCallback(id);
      }
      // Handle errors
    });
  });
}

module.exports = router;
