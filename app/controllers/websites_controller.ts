import Project from '#modules/project/models/project.js'
import Skill from '#modules/skill/models/skill.js'
import Experience from '#modules/experience/models/experience.js'
import Setting from '#modules/setting/models/setting.js'
import { resourceResponse } from '../utils/http_response.js'
import ProjectResource from '#modules/project/transformers/project_resource.js'
import SkillResource from '#modules/skill/transformers/skill_resource.js'
import ExperienceResource from '#modules/experience/transformers/experience_resource.js'
import SettingResource from '#modules/setting/transformers/setting_resource.js'

export default class WebsitesController {
    public async handle() {
        const projects = await Project.query().latest('priority').preload('image').exec()
        const skills = await Skill.query().preload('image').latest('priority').exec()
        const experiences = await Experience.query().latest('priority').preload('company').exec()
        const settings = await Setting.query().firstOrFail()

        return resourceResponse({
            projects: await ProjectResource.collection(projects),
            skills: await SkillResource.collection(skills),
            experiences: await ExperienceResource.collection(experiences),
            settings: await SettingResource.make(settings),
        })
    }
}
