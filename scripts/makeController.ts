
import * as process from 'process';
import controllerGenerator from './generator/controllerGenerator';

// Ambil argumen dari command line
const [, , name] = process.argv;

const parsedName = name.split('-').map((n: string) => n.charAt(0).toUpperCase() + n.substring(1)).join('');

if (!parsedName || parsedName === undefined) {
    console.error(`argument 'name' is required\nusage: pnpm run make:controller NameController`);
    process.exit(1);
}

if (process.argv.length > 3) {
    console.error(`invalid argument.\nusage: pnpm run make:controller NameController`)
}

// Generate controller
controllerGenerator.generate(parsedName);