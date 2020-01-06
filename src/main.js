const shell = require('shelljs')
const env = process.argv[2] || '--prod'

function isTargetBranchMain (branchName) {
  return shell.exec('git branch | grep \\* | cut -d \' \' -f2').indexOf(branchName) !== -1
}

function checkoutSubModuleBranchForDev (branchName) {
  // eslint-disable-next-line
  const submodulePath = shell.head({ '-n': 2 }, '.gitmodules').stdout.match(/path\s*\=\s*(.+)/)[1]

  shell.cd(submodulePath)

  const branchListStr = shell.exec('git branch')
  const currentSubmoduleBranchName = branchListStr.match(/\*\s(.+)\b/)[1]
  const hasSubmoduleBranchName = branchListStr.indexOf(branchName) !== -1

  if (currentSubmoduleBranchName === branchName) {
    shell.exec(`git pull`)
  } else {
    if (hasSubmoduleBranchName) {
      shell.exec(`git checkout ${branchName} && git pull`)
    } else {
      shell.exec(`git checkout -b ${branchName} origin/${branchName}`)
    }
  }
}

function checkoutSubModuleBranchForProd () {
  const isMasterMain = isTargetBranchMain('master')
  if (!isMasterMain) {
    shell.exec("git submodule foreach 'git checkout zelda'")
  }
}

export default (function run () {
  if (env === '--dev') {
    const submoduleName = process.argv[3] || 'master'
    checkoutSubModuleBranchForDev(submoduleName)
  } else if (env === '--prod') {
    checkoutSubModuleBranchForProd()
  }
})()
