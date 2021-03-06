/**
 DOM selectors
*/

function callStackPane() {
  return cy.get(".call-stack-pane");
}

function callStackFrameAtIndex(index) {
  return cy.get(`.frames .frame:nth-child(${index})`)
}

function breakpointPane() {
  return cy.get(".breakpoints-pane .breakpoints-list");
}

function breakpointAtIndex(index) {
  return cy.get(`.breakpoints-list .breakpoint:nth-child(${index})`);
}

function commandBar() {
  return cy.get(".right-sidebar .command-bar");
}

function sourceFooter() {
  return cy.get(".source-footer");
}

function scopesPane() {
  return cy.get(".scopes-pane");
}

function scopeAtIndex(index) {
  return cy.get(`.scopes-list .tree-node:nth-child(${index})`)
}

function scopes() {
  return scopesPane().find(".scopes-list > .tree");
}
/**
  DOM commands
*/

/**
  1. load the debugger and connect to the first chrome or firefox tab
  2. cy.navigate the browser tab to the right rul
  3. refresh the debugger to guarantee the data is correct

  the test delays are safeguards for the timebeing, but they should
  be able to be removed if the test waits for the elements to appear.
 */
function debugPage(urlPart, browser = "Firefox") {
  debugFirstTab(browser);
  cy.wait(1000);
  cy.navigate(urlPart)
  cy.wait(1000);
  toggleCallStack();
  toggleScopes();
}

function debugFirstTab(browser = "Firefox") {
  cy.visit("http://localhost:8000");
  cy.get(`.${browser} .tab`).first().click();
}

function keyEvent(key, cmdOrCtrl) {
  const isMac = window.navigator.userAgent.includes("Mac")
  return Object.assign(new Event("keydown"), {
    key,
    metaKey: cmdOrCtrl && isMac,
    ctrlKey: cmdOrCtrl && !isMac,
    altKey: false,
    shiftKey: false
  })
}

function goToSource(source) {
  cy.window().then(win => {
    win.dispatchEvent(keyEvent("p", true))
  });

  cy.get(".autocomplete input").type(source)
  cy.get(".autocomplete .results li").first().click()
}

function sourcesList() {
  return cy.get(".sources-list")
}

function toggleBreakpoint(linenumber) {
  cy.window().then(win => {
    cy.wrap(win.cm)
      .invoke("scrollIntoView", { line: linenumber, ch: 0 });
  });

  cy.get(".CodeMirror")
    .contains(".CodeMirror-linenumber", linenumber)
    .click()

  cy.get(".CodeMirror")
    .contains(".CodeMirror-linenumber", linenumber)
    .should("not.have.class", "breakpoint-disabled")
}

function addWatchExpression(expression) {
  cy.get(".input-expression").type(`${expression}{enter}`)
}

function selectBreakpointInList(index) {
  breakpointAtIndex(index).click();
}

function toggleBreakpointInList(index) {
  breakpointAtIndex(index).find("input[type='checkbox']").click();
}

function toggleCallStack() {
  callStackPane().find("._header").click();
}

function selectCallStackFrame(index) {
  callStackFrameAtIndex(index).click();
}

function toggleScopes() {
  scopesPane().find("._header").click();
}

function selectScope(index) {
  cy.get(`.scopes-list .tree-node:nth-child(${index}) .arrow`).click();
}

function resume() {
  cy.get(".active.resume").click();
}

function stepOver() {
  cy.get(".active.stepOver").click();
}

function stepIn() {
  cy.get(".active.stepIn").click();
}

function stepOut() {
  cy.get(".active.stepOut").click();
}

function breakOnNext() {
  cy.get(".active.pause").click();
}

function prettyPrint() {
  return sourceFooter().get("span.prettyPrint.active").click()
}

/**
 DOM queries
*/

function sourceTab(fileName) {
  return cy.get(".source-tab");
}

Object.assign(window, {
  debugPage,
  debugFirstTab,
  goToSource,
  breakpointAtIndex,
  toggleBreakpoint,
  selectBreakpointInList,
  toggleBreakpointInList,
  toggleCallStack,
  callStackFrameAtIndex,
  toggleScopes,
  scopeAtIndex,
  scopes,
  selectScope,
  sourcesList,
  sourceTab,
  resume,
  stepIn,
  stepOut,
  stepOver,
  breakOnNext,
  prettyPrint,
  addWatchExpression
})
