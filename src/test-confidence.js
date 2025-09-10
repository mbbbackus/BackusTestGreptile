// Mock test for confidence score header replacement

function testConfidenceScoreReplacement() {
  const inputString = "## Confidence score: 5/5\n\n"
  
  // Mock context with different configurations
  const contexts = [
    // Test with collapsible enabled, defaultOpen true
    {
      config: {
        confidenceScoreSection: {
          collapsible: true,
          defaultOpen: true
        }
      }
    },
    // Test with collapsible enabled, defaultOpen false
    {
      config: {
        confidenceScoreSection: {
          collapsible: true,
          defaultOpen: false
        }
      }
    },
    // Test with collapsible disabled
    {
      config: {
        confidenceScoreSection: {
          collapsible: false
        }
      }
    }
  ]

  contexts.forEach((context, index) => {
    let confidenceContent = inputString
    
    // Replace the header with collapsible structure if collapsible is enabled
    if (context.config?.confidenceScoreSection?.collapsible) {
      const headerPattern = /^##\s+Confidence [Ss]core(?:\s*:.*)?$/m
      const openAttr = context.config.confidenceScoreSection.defaultOpen ? ' open' : ''
      confidenceContent = confidenceContent.replace(headerPattern, (match) => {
        const scoreMatch = match.match(/:\s*(.+)$/)
        const score = scoreMatch ? scoreMatch[1].trim() : ''
        return `<details${openAttr}><summary><h2>Confidence Score${score ? ': ' + score : ''}</h2></summary>`
      })
      confidenceContent += '</details>'
    }
    
    console.log(`Test ${index + 1}:`)
    console.log(`Config: collapsible=${context.config.confidenceScoreSection.collapsible}, defaultOpen=${context.config.confidenceScoreSection.defaultOpen}`)
    console.log(`Result: ${JSON.stringify(confidenceContent)}`)
    console.log('---')
  })
}

testConfidenceScoreReplacement()