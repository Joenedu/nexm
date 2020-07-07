var express = require('express');
const shortid = require('shortid');
var events = require('events');
var eventEmitter = new events.EventEmitter();
var mysql = require('mysql');
var url = require('url');

var router = express.Router();

var con  = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'mddb'
});

// Home page route.
router.get('/', (req, res)=>{
    res.render('index');
});
router.get(/.*edit$/, (req, res, next)=>{

   url = req.url.slice(-(req.url.length), -5)
   con.query('select * from mdusers where url = "'+url+'"', (selectErr, selectResult, selectFields)=>{  
    if(selectResult.length == 0){
        res.render('notfound.ejs',{});
    //res.json('Result error : '+JSON.stringify(selectResult.length));          
    }else{
        res.render('edit', {editSelect: selectResult});
    }
    
});

});
router.get(/.*[^\/]$/, (req, res)=>{
    
   // var url_parts = url.parse(req.url);
    //res.send(req.url);
    //res.send(req.params);
    //console.log('preview route');
            con.query('select * from mdusers where url ="'+req.url+'"',(selectErr, selectResult, selectFields)=>{
                if(selectResult.length == 0){
                    res.render('notfound.ejs',{});
                    //res.json('Result error : '+JSON.stringify(selectResult.length));
                        
                }else{
                        /*var showdown  = require('showdown'),
                        converter = new showdown.Converter(),
                        text = selectResult[0].markdown,
                        html = converter.makeHtml(text);*/
                            //res.set({ 'content-type': 'text/html; charset=utf-8' });    
                            eventEmitter.on('preview', ()=>{
                                console.log('loading preview...');
                            });
                            eventEmitter.emit('preview');
                            res.render('previewEdit', {previewEvent: eventEmitter, queryResult: selectResult, markDown: selectResult[0].markdown});
                }
            });
            //con.destroy();
    
});

router.post('/', (req, res)=>{
    //Begin checking the length of markdown input textbox
    if (req.body.markdownInput.length <= 0) {      
       res.render('index', {emptyField: "This field is required."});
    } else {
        markdown = req.body.markdownInput.trim();
        //console.log(markdown);
        //Begin checking the length of custom url
        if(req.body.customUrl.length > 0){
            customUrl = '/'+req.body.customUrl;
        }else{
            customUrl = '/'+Math.random().toString(36).substr(2, 5);
        }//End of checking custom url length

        //Begin checking the length custom edit code
        if(req.body.customEditCode.length > 0){
            customEditCode = req.body.customEditCode;
        }else{
            //customEditCode = shortid.generate();
            customEditCode = Math.random().toString(36).substr(2, 8);
        }//End checking the length custom edit code

        con.query(`insert into mdusers values('null','${markdown}', '${customEditCode}', '${customUrl}' )`, (err, result)=>{
            if(err){
                res.render('error.ejs',{insertError: err});
            }else{
                con.query('select * from mdusers where url = "'+customUrl+'"', (selectErr, selectResult, selectFields)=>{
                        if(selectErr){
                            console.log(`${selectErr}`);
                        }else{
                            res.redirect(''+selectResult[0].url); 
                        }
                });
                
            }
        });
    }
});

router.post(/.*edit$/, (req, res)=>{
    //console.log('markdown editing...');
    var editCode = req.body.editCode;
    //console.log('Edit code now : '+newEditCode); 
    var url = '';
    
    if(req.body.saveBtn){//Begin check whether save button is clicked
        if(req.body.editCode.length > 0){//Begin edit code length check         
            con.query('select * from mdusers where edit_code = "'+editCode+'"', (err, results, fields)=>{

                    if(req.body.newUrl.length > 0){
                        //console.log('Edit code : '+req.body.editCode);
                        url = '/'+req.body.newUrl.trim();
                        //console.log('New url: '+url);
                    }else{
                        if(results[0] != undefined){
                            url = results[0].url.trim();
                            //console.log('Old url: '+url);
                        }
                    }
                   //Checking the result of whether edit code exists
                    if(results.length > 0){
                        var newEditCode = '';
                        if(req.body.newEditCode.length > 0){
                            newEditCode = req.body.newEditCode;
                            //console.log('new edit code not empty: '+newEditCode);
                        }else{
                            newEditCode = req.body.editCode;
                           // console.log('new edit code empty: '+newEditCode);
                        }
                            var data = [req.body.markdownInput.trim(), url, newEditCode, editCode ];
                            //console.log(data);
                            con.query(`update mdusers set markdown = ?, url = ?, edit_code = ? where edit_code = ?`,data, (err, results, fields)=>{
                            if (err){
                                //console.log(err.message);
                            }else{
                                //alert('updated');
                                //console.log('Updated Rows affected:', results.affectedRows);
                                    con.query('select * from mdusers where edit_code = "'+newEditCode+'"', (selectErr, selectResult, selectFields)=>{
                                        if(selectErr){
                                            //console.log(`${selectErr}`);
                                        }else{
                                            //console.log(selectResult);
                                            //console.log(newEditCode);
                                            res.redirect(''+selectResult[0].url); 
                                        }
                                });
                            }
                            
                        });
                    }else{
                        //res.redirect(200, 'edit');
                        res.render('edit', {saveError: "Invalid edit code."});
                        //console.log('Oops!');
                    }
                  
            });
          //End Edit Code length check  
        }else{
            return console.log('Edit code empty');
        }
      //End checking whether save button is clicked  
    }else if(req.body.deleteBtn){//Begin checking whether delete button is clicked
        if(req.body.editCode.length > 0){
        var editCode = req.body.editCode;
        con.query('select * from mdusers where edit_code = "'+editCode+'"', (err, results, fields)=>{
            if (err != null){
                //console.log(err.message);
              }
              //console.log(`${JSON.stringify(results)}`);
              if((Object.entries(results).length > 0)){
               
                        con.query(`delete from mdusers where edit_code = '${editCode}'`,(err, result)=>{
                            //console.log(`${JSON.stringify(result)}`);
                            if (!(result.affectedRows <= 0)){
                                res.redirect('/');
                            }else if(result.affectedRows <= 0){
                                res.render('edit', {deleteError: "Operation failed.."});
                            }
                        });//end of delete stmt
                    
                
              }else{
                res.render('edit', {deleteError: "An error occured."});
                //console.log('Could not delete markdown!');
              }
            });
            
        }
        else{
            //console.log('Operation aborted');
        }
     //End checking whether delete button is clicked  
    }else{
        //console.log('No operation selected');
    }

    
});


module.exports = router;
