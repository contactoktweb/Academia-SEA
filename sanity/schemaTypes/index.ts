import { type SchemaTypeDefinition } from 'sanity'
import { globalConfig } from './globalConfig'
import { heroHome } from './heroHome'
import { whySection } from './whySection'
import { coursesTeaser } from './coursesTeaser'
import { certificationsTeaser } from './certificationsTeaser'
import { ctaSection } from './ctaSection'
import { aboutHero } from './aboutHero'
import { aboutTimeline } from './aboutTimeline'
import { aboutPhilosophy } from './aboutPhilosophy'
import { aboutValues } from './aboutValues'
import { aboutModalities } from './aboutModalities'
import { contactPage } from './contactPage'
import { coursesPage } from './coursesPage'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [globalConfig, heroHome, whySection, coursesTeaser, certificationsTeaser, ctaSection, aboutHero, aboutTimeline, aboutPhilosophy, aboutValues, aboutModalities, contactPage, coursesPage],
}
