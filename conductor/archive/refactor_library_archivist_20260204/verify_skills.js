const fs = require('fs')
const path = require('path')

const skillsDir = path.join(__dirname, '../../../.gemini/skills')

const skillsToVerify = [
  {
    name: 'archivist-retriever',
    requiredTriggers: ['Any task involving libraries', 'Direct questions'],
    requiredMandates: ['Library First', 'Exhaustive Search'],
    requiredWorkflows: ['Retrieval & Activation'],
  },
  {
    name: 'archivist-researcher',
    requiredTriggers: ['activated by archivist-retriever', 'new technologies'],
    requiredMandates: ['Verified Sources', 'User Approval', 'Ingestion Ready'],
    requiredWorkflows: ['Research & Ingestion'],
  },
  {
    name: 'archivist-librarian',
    requiredTriggers: ['archivist-researcher', 'reference-material/ingestion'],
    requiredMandates: [
      'Consistent Naming',
      'Standard Formatting',
      'Logical Categorization',
    ],
    requiredWorkflows: ['Sorting & Organization'],
  },
  {
    name: 'archivist-cleaner',
    requiredTriggers: ['Explicit user request'],
    requiredMandates: ['Deduplication', 'Link Integrity', 'Reference Accuracy'],
    requiredWorkflows: ['Maintenance & Cleanup'],
  },
]

function verifySkill(skillInfo) {
  const skillPath = path.join(skillsDir, skillInfo.name, 'SKILL.md')
  console.log(`Verifying skill: ${skillInfo.name} at ${skillPath}`)

  if (!fs.existsSync(skillPath)) {
    console.error(`  FAIL: Skill file not found!`)
    return false
  }

  const content = fs.readFileSync(skillPath, 'utf8').replace(/`/g, '')
  let success = true

  skillInfo.requiredTriggers.forEach((t) => {
    if (!content.toLowerCase().includes(t.toLowerCase())) {
      console.error(`  FAIL: Missing trigger: "${t}"`)
      success = false
    }
  })

  skillInfo.requiredMandates.forEach((m) => {
    if (!content.toLowerCase().includes(m.toLowerCase())) {
      console.error(`  FAIL: Missing mandate: "${m}"`)
      success = false
    }
  })

  skillInfo.requiredWorkflows.forEach((w) => {
    if (!content.toLowerCase().includes(w.toLowerCase())) {
      console.error(`  FAIL: Missing workflow: "${w}"`)
      success = false
    }
  })

  if (success) {
    console.log(`  PASS: Skill ${skillInfo.name} verified.`)
  }
  return success
}

let allSuccess = true
skillsToVerify.forEach((s) => {
  if (!verifySkill(s)) allSuccess = false
})

if (!allSuccess) {
  process.exit(1)
}
console.log('All skills verified successfully!')
