function onOpen(){
  // set up menu here
  Logger.log("onOpen()")
  const ui = SpreadsheetApp.getUi()
  ui.createMenu("Formulas")
    .addItem("View Formulas", "showDialog")
    .addToUi();
}
function highlightArrayFormulas(){
  const shCurrent = SpreadsheetApp.getActive().getActiveSheet()
  const data = shCurrent.getRange(1, 1, shCurrent.getMaxRows(), shCurrent.getMaxColumns()).getFormulas();
  const q =[], a = [], s = [], o = []
  data.forEach( ( row, iR ) => {
    row.forEach( ( cellF, iC ) => {
      if ( cellF !== "" ){
        let formula = [
            ( iR + 1) + "," + ( iC + 1),
            shCurrent.getRange( ( iR + 1), ( iC + 1) ).getA1Notation(),
            cellF
        ]
        let func = cellF.slice(1, cellF.indexOf("(") ).toLowerCase()
        if ( func === "query" ){
          q.push( formula )
        } else if ( func === "arrayformula" ){
          a.push( formula )
        } else if ( func === "sequence" ){
          s.push( formula )
        } else {
          o.push( formula )
        }
      }
    })
  })
  const ret = []
  ret.push( q, a, s, o )
  return ret
}

function gsGotoCell( cellAddr ){
  SpreadsheetApp.getActive().getActiveSheet().getRange( cellAddr ).activate()
  return true
}

function printOutFormulas( formulas ){
  formulas.forEach( f => {
    Logger.log( `(${f.row},${f.col}: ${f.func} - ${f.expr}` )
  })
}

function showDialog(){
  var t = HtmlService.createTemplateFromFile('dialog');
  t.data = highlightArrayFormulas()
  const html = t.evaluate();
  var dialog = HtmlService.createHtmlOutput( html )
      .setWidth(600)
      .setHeight(300);
  SpreadsheetApp.getUi()
      .showModelessDialog(dialog, 'Formulas');

  //SpreadsheetApp.getUi().showSidebar(html);
}
