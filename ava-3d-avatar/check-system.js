/**
 * Quick System Check Script
 * Verifies all components are in place
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

console.log('\n' + '='.repeat(60));
log('🔍 SYSTEM VERIFICATION CHECK', 'cyan');
console.log('='.repeat(60) + '\n');

let allPassed = true;

// Check 1: Backend files
log('Check 1: Backend Files', 'blue');
const backendFiles = [
  'apps/backend/server.js',
  'apps/backend/modules/whisper.mjs',
  'apps/backend/modules/openAI.mjs',
  'apps/backend/modules/elevenLabs.mjs',
  'apps/backend/modules/lip-sync.mjs',
  'apps/backend/modules/rhubarbLipSync.mjs',
  'apps/backend/ffmpeg.exe',
  'apps/backend/rhubarb.exe',
];

backendFiles.forEach(file => {
  const fullPath = path.join(__dirname, file);
  if (fs.existsSync(fullPath)) {
    log(`  ✅ ${file}`, 'green');
  } else {
    log(`  ❌ ${file} - MISSING!`, 'red');
    allPassed = false;
  }
});

// Check 2: Frontend files
log('\nCheck 2: Frontend Files', 'blue');
const frontendFiles = [
  'apps/frontend/src/App.jsx',
  'apps/frontend/src/hooks/useSpeech.jsx',
  'apps/frontend/src/hooks/useVoiceActivityDetection.jsx',
  'apps/frontend/src/components/Avatar.jsx',
  'apps/frontend/src/components/console/CommandConsole.jsx',
  'apps/frontend/src/components/hud/STSStatusIndicator.jsx',
];

frontendFiles.forEach(file => {
  const fullPath = path.join(__dirname, file);
  if (fs.existsSync(fullPath)) {
    log(`  ✅ ${file}`, 'green');
  } else {
    log(`  ❌ ${file} - MISSING!`, 'red');
    allPassed = false;
  }
});

// Check 3: Environment variables
log('\nCheck 3: Environment Variables', 'blue');
const envPath = path.join(__dirname, 'apps/backend/.env');
if (fs.existsSync(envPath)) {
  log(`  ✅ .env file exists`, 'green');
  
  const envContent = fs.readFileSync(envPath, 'utf8');
  const requiredVars = [
    'OPENAI_API_KEY',
    'GROQ_API_KEY',
    'ELEVEN_LABS_API_KEY',
    'ELEVEN_LABS_VOICE_ID',
    'ELEVEN_LABS_MODEL_ID'
  ];
  
  requiredVars.forEach(varName => {
    if (envContent.includes(varName)) {
      const match = envContent.match(new RegExp(`${varName}=(.+)`));
      if (match && match[1] && match[1].trim() && !match[1].includes('YOUR_')) {
        log(`  ✅ ${varName} is set`, 'green');
      } else {
        log(`  ⚠️  ${varName} is not configured`, 'yellow');
      }
    } else {
      log(`  ❌ ${varName} is missing`, 'red');
      allPassed = false;
    }
  });
} else {
  log(`  ❌ .env file not found!`, 'red');
  allPassed = false;
}

// Check 4: Package.json files
log('\nCheck 4: Package Files', 'blue');
const packageFiles = [
  'apps/backend/package.json',
  'apps/frontend/package.json',
];

packageFiles.forEach(file => {
  const fullPath = path.join(__dirname, file);
  if (fs.existsSync(fullPath)) {
    log(`  ✅ ${file}`, 'green');
  } else {
    log(`  ❌ ${file} - MISSING!`, 'red');
    allPassed = false;
  }
});

// Check 5: Node modules
log('\nCheck 5: Dependencies Installed', 'blue');
const nodeModulesDirs = [
  'apps/backend/node_modules',
  'apps/frontend/node_modules',
];

nodeModulesDirs.forEach(dir => {
  const fullPath = path.join(__dirname, dir);
  if (fs.existsSync(fullPath)) {
    log(`  ✅ ${dir}`, 'green');
  } else {
    log(`  ⚠️  ${dir} - Run npm install`, 'yellow');
  }
});

// Check 6: Documentation
log('\nCheck 6: Documentation Files', 'blue');
const docFiles = [
  'API_SETUP_GUIDE.md',
  'CONVERSATION_MODE_GUIDE.md',
  'SPEECH_TO_SPEECH_GUIDE.md',
  'SYSTEM_VERIFICATION.md',
];

docFiles.forEach(file => {
  const fullPath = path.join(__dirname, file);
  if (fs.existsSync(fullPath)) {
    log(`  ✅ ${file}`, 'green');
  } else {
    log(`  ⚠️  ${file} - Documentation missing`, 'yellow');
  }
});

// Summary
console.log('\n' + '='.repeat(60));
log('📊 VERIFICATION SUMMARY', 'cyan');
console.log('='.repeat(60));

if (allPassed) {
  log('\n✅ All critical checks passed!', 'green');
  log('\n🚀 Next Steps:', 'cyan');
  log('  1. Ensure API keys are configured in .env', 'cyan');
  log('  2. Run: cd apps/backend && npm install', 'cyan');
  log('  3. Run: cd apps/frontend && npm install', 'cyan');
  log('  4. Start backend: cd apps/backend && node server.js', 'cyan');
  log('  5. Start frontend: cd apps/frontend && npm run dev', 'cyan');
  log('  6. Test the system!\n', 'cyan');
} else {
  log('\n❌ Some checks failed!', 'red');
  log('\n🔧 Action Required:', 'yellow');
  log('  1. Fix missing files listed above', 'yellow');
  log('  2. Configure API keys in .env', 'yellow');
  log('  3. Install dependencies', 'yellow');
  log('  4. Re-run this check\n', 'yellow');
}

console.log('='.repeat(60) + '\n');
