(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = global || self, global.npmLibraryDemo = factory());
}(this, (function () { 'use strict';

  var shell = require('shelljs');

  var env = process.argv[2] || '--prod';

  function isTargetBranchMain(branchName) {
    return shell.exec('git branch | grep \\* | cut -d \' \' -f2').indexOf(branchName) !== -1;
  }

  function checkoutSubModuleBranchForDev(branchName) {
    // eslint-disable-next-line
    var submodulePath = shell.head({
      '-n': 2
    }, '.gitmodules').stdout.match(/path\s*\=\s*(.+)/)[1];
    shell.cd(submodulePath);
    var branchListStr = shell.exec('git branch');
    var currentSubmoduleBranchName = branchListStr.match(/\*\s(.+)\b/)[1];
    var hasSubmoduleBranchName = branchListStr.indexOf(branchName) !== -1;

    if (currentSubmoduleBranchName === branchName) {
      shell.exec("git pull");
    } else {
      if (hasSubmoduleBranchName) {
        shell.exec("git checkout ".concat(branchName, " && git pull"));
      } else {
        shell.exec("git checkout -b ".concat(branchName, " origin/").concat(branchName));
      }
    }
  }

  function checkoutSubModuleBranchForProd() {
    var isMasterMain = isTargetBranchMain('master');

    if (!isMasterMain) {
      shell.exec("git submodule foreach 'git checkout zelda'");
    }
  }

  var main = (function run() {
    if (env === '--dev') {
      var submoduleName = process.argv[3] || 'master';
      checkoutSubModuleBranchForDev(submoduleName);
    } else if (env === '--prod') {
      checkoutSubModuleBranchForProd();
    }
  })();

  return main;

})));
//# sourceMappingURL=index.js.map
