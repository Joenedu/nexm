function openTab(evt, tabName) {
  //alert('processing...');
  convertToHTML();
    var i, x, tablinks;
    x = document.getElementsByClassName("markdownEditor");
    for (i = 0; i < x.length; i++) {
      x[i].style.display = "none";
    }
    tablinks = document.getElementsByClassName("tablink");
    for (i = 0; i < x.length; i++) {
      tablinks[i].className = tablinks[i].className.replace(" w3-white", "");
    }
    document.getElementById(tabName).style.display = "block";
    evt.currentTarget.className += " w3-white";
  }

  /*window.onload = ()=>{
    document.getElementById('markdownInput').focus();
    convertToHTML();
    //convertToHTMLQueryResult();
    //generateRand();
    alert('hello, world.');
  }*/

  window.addEventListener('load', (event)=>{
    //console.log(event);
    try {
      document.getElementById('markdownInput').focus();
      convertToHTML();
    } catch (error) {
      if (error.name === 'TypeError') {
        convertToHTMLPreview();
      }
    }
    
  });

  function convertToHTML(){
    converter = new showdown.Converter({
        simplifiedAutoLink: true,
        simpleLineBreaks: true,
        parseImgDimensions: true,
        smoothLivePreview: true,
        completeHTMLDocument: true,
        omitExtraWLInCodeBlocks: true,
        strikethrough: true,
        tables: true,
        tasklists: true,
        smartIndentationFix: true,
    }),
    markdownInput= document.getElementById('markdownInput').value,
    html = converter.makeHtml(markdownInput);   
    document.getElementById('markdownPreview').innerHTML = html;
    document.getElementById('markdownPreviewTab').innerHTML = html;
  }

  function convertToHTMLPreview(){
    converter = new showdown.Converter({
      simplifiedAutoLink: true,
      simpleLineBreaks: true,
      parseImgDimensions: true,
      smoothLivePreview: true,
      completeHTMLDocument: true,
      omitExtraWLInCodeBlocks: true,
      strikethrough: true,
      tables: true,
      tasklists: true,
      smartIndentationFix: true,
  }),
  markdownInput= document.getElementById('markdownPreviewEdit').innerHTML,
  html = converter.makeHtml(markdownInput);   
  document.getElementById('markdownPreviewEdit').innerHTML = html;
  }

  function convertToHTMLQueryResult(){
    converter = new showdown.Converter({
        simplifiedAutoLink: true,
        simpleLineBreaks: true,
        parseImgDimensions: true,
        smoothLivePreview: true,
        completeHTMLDocument: true,
        omitExtraWLInCodeBlocks: true,
        strikethrough: true,
        tables: true,
        tasklists: true,
        smartIndentationFix: true,
    }),
    markdownInput= document.getElementById('markdownPreviewEdit').innerHTML,
    html = converter.makeHtml(markdownInput);   
    document.getElementById('markdownPreviewEdit').innerHTML = html;
  }
  
    function convertToMarkdown(){
    converter = new showdown.Converter(),
    htmlInput = document.getElementById('htmlInput').innerHTML,
    md = converter.makeMarkdown(htmlInput);
    document.getElementById('output').innerHTML = md;
  }  