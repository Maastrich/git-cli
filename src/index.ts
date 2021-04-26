import program from "commander";

program
  .version('0.0.1')
  .name('ms-cli')
  .usage('[command] [options]')

program
  .command('repo', 'Manage your org/user repositories tree', {
    executableFile: './bin/ms-cli-repo'
  }).aliases(['', 'r'])

program
  .command('test', 'test', {
    executableFile: 'echo'
  }).aliases(['', 't'])

program.parse(process.argv);
