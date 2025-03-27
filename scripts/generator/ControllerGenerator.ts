import * as path from "path";
import * as fs from "fs";
import { generateControllerTemplate } from "../templates/controller.template";

class ControllerGenerator
{
    // define controller dir and template path
    private controllersDir: string = '';
    private templatePath: string = '';

    constructor () {
        this.controllersDir = path.join(__dirname, '..', '..', 'src', 'controllers');
        this.templatePath = path.join(__dirname, 'templates', 'controller.template.ts');
    }

    // define ensure directory is exists
    private ensureDirectoryExists (dirPath: string): void
    {
        if (!fs.existsSync(dirPath)) {
            fs.mkdirSync(dirPath, { recursive: true });
        }
    }

    // define generator method
    public generate (controllerName: string): void
    {
        // call ensure directory exists
        this.ensureDirectoryExists(this.controllersDir);

        // make controller path
        const controllerPath = path.join(this.controllersDir, `${controllerName}.ts`);

        // check if exists controller path
        if (fs.existsSync(controllerPath)) {
            console.error(`controller ${controllerName} already exists! `);
            process.exit(1);
        }

        // call generate controller template
        const controllerContent: string = generateControllerTemplate(controllerName);

        // write file in new path of controller
        fs.writeFileSync(controllerPath, controllerContent, 'utf-8');

        // print success
        console.log(`controller ${controllerName} successfully created at ${controllerPath}`);

    }

}

export default new ControllerGenerator();