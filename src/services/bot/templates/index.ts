import { renderFile } from "template-file";
import { TemplateInterface, TemplateKind } from "./types";
import { join, resolve } from "path";
import { TEMPALTE_PATHES } from "./consts";

class BotMessageTextTemplates {
  private getTemplatePath(template: TemplateKind): string {
    const path = resolve(join(__dirname, TEMPALTE_PATHES[template]));
    return path;
  }

  public async getTemplate(template: TemplateInterface): Promise<string> {
    const path = this.getTemplatePath(template.type);
    const text = await renderFile(path, template.payload);

    return text;
  }
}

export const textTemplates = new BotMessageTextTemplates();
