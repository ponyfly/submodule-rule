// 交互式命令行
const inquirer = require('inquirer')
// 修改控制台字符串的样式
const chalk = require('chalk')
// node 紫禁城
const exec = require('child_process').exec
const shell = require('shelljs')
const env = process.argv[2] || '--prod'

function isTargetBranchMain (branchName) {
  return shell.exec('git branch | grep \\* | cut -d \' \' -f2').indexOf(branchName) !== -1
}

function checkoutSubModuleBranchForDev () {
  // eslint-disable-next-line
  const submodulePath = shell.head({ '-n': 2 }, '.gitmodules').stdout.match(/path\s*\=\s*(.+)/)[1]

  shell.cd(submodulePath)

  // 自定义交互式命令行的问题
  let questions = [
    {
      name: "branch",
      type: 'list',
      message: "请输入submodule分支名称",
      default: '',
      choices: []
    }
  ]
  exec(`git branch`, function(err, stdout, stderr) {
    if (err) {
      console.log(chalk.red(stderr))
      return
    }
    const branchesStr = stdout.trim()
    const branches = branchesStr.replace(/\*|\n/gm,'').split(/\s+/)
    const currentBranch = stdout.match(/\*\s(.+)\b/)[1]
    questions[0].default = currentBranch || 'master'
    questions[0].choices = branches.map(br => {
      return {
        name: br,
        value: br
      }
    })

    // 需要回答的问题
    inquirer
      .prompt(questions).then(answers => {
      // answers 就是用户输入的内容，是个对象
      let { branch } = answers;

      exec(`git checkout ${branch}`, function (err, stdout, stderr) {
        if (err) {
          console.log(chalk.red(stderr))
          return
        }
        console.log('\n')
        console.log(chalk.green('switch submodule branch successfully!\n'))
        console.log(chalk.cyan(`The current submodule branch is: ${branch} \n`))
      })
    })
  })
}

function checkoutSubModuleBranchForProd () {
  const isMasterMain = isTargetBranchMain('master')
  if (!isMasterMain) {
    exec("git submodule foreach 'git checkout zelda'", function (err, stdout, stderr) {
      if (err) {
        console.log(stderr)
        return
      }
      console.log('\n')
      console.log(chalk.green('switch submodule branch successfully!\n'))
      console.log(chalk.cyan(`The current submodule branch is: zelda \n`))
    })
  }
}

export default (function run () {
  if (env === '--dev') {
    checkoutSubModuleBranchForDev()
  } else if (env === '--prod') {
    checkoutSubModuleBranchForProd()
  }
})()
