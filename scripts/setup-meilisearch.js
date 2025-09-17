#!/usr/bin/env node

/**
 * MeiliSearch Setup Script
 * Creates required indexes for product search
 */

import { MeiliSearch } from 'meilisearch'

async function setupMeiliSearch() {
  // Skip if MeiliSearch is not configured
  if (!process.env.MEILISEARCH_HOST) {
    console.log('ℹ️  MeiliSearch not configured, skipping setup')
    return
  }

  console.log('🔍 Setting up MeiliSearch indexes...')
  
  try {
    // Create MeiliSearch client
    const client = new MeiliSearch({
      host: process.env.MEILISEARCH_HOST,
      apiKey: process.env.MEILISEARCH_API_KEY || process.env.MEILI_MASTER_KEY
    })
    
    // Define indexes to create
    const indexes = [
      {
        uid: 'products',
        primaryKey: 'id',
        settings: {
          searchableAttributes: [
            'title',
            'subtitle',
            'description',
            'handle',
            'material',
            'collection_title',
            'type_value'
          ],
          filterableAttributes: [
            'status',
            'collection_id',
            'collection_handle',
            'type_value',
            'tags',
            'price',
            'weight'
          ],
          sortableAttributes: [
            'created_at',
            'updated_at',
            'price',
            'weight'
          ],
          displayedAttributes: [
            'id',
            'title',
            'subtitle',
            'description',
            'handle',
            'thumbnail',
            'images',
            'price',
            'collection_title',
            'type_value'
          ],
          rankingRules: [
            'words',
            'typo',
            'proximity',
            'attribute',
            'sort',
            'exactness'
          ]
        }
      },
      {
        uid: 'product_variants',
        primaryKey: 'id',
        settings: {
          searchableAttributes: [
            'title',
            'sku',
            'barcode',
            'ean',
            'upc'
          ],
          filterableAttributes: [
            'product_id',
            'inventory_quantity',
            'allow_backorder'
          ],
          sortableAttributes: [
            'created_at',
            'inventory_quantity'
          ]
        }
      },
      {
        uid: 'collections',
        primaryKey: 'id',
        settings: {
          searchableAttributes: [
            'title',
            'handle'
          ],
          filterableAttributes: ['handle'],
          sortableAttributes: ['created_at']
        }
      }
    ]
    
    // Create or update indexes
    for (const indexConfig of indexes) {
      const { uid, primaryKey, settings } = indexConfig
      
      try {
        // Try to get existing index
        const index = await client.getIndex(uid)
        console.log(`ℹ️  Index '${uid}' already exists, updating settings...`)
        
        // Update settings
        await index.updateSettings(settings)
        console.log(`✅ Updated index settings for '${uid}'`)
        
      } catch (error) {
        // Index doesn't exist, create it
        if (error.code === 'index_not_found') {
          console.log(`Creating new index: ${uid}`)
          const index = await client.createIndex(uid, { primaryKey })
          
          // Wait for index creation
          await new Promise(resolve => setTimeout(resolve, 1000))
          
          // Apply settings
          await index.updateSettings(settings)
          console.log(`✅ Created index '${uid}' with settings`)
        } else {
          throw error
        }
      }
    }
    
    // Verify setup
    const stats = await client.getStats()
    console.log(`✅ MeiliSearch setup completed. Indexes: ${Object.keys(stats.indexes).length}`)
    
  } catch (error) {
    console.error('❌ MeiliSearch setup failed:', error.message)
    // Don't fail deployment if MeiliSearch setup fails
    if (process.env.RAILWAY_ENVIRONMENT) {
      console.log('⚠️  Continuing deployment without MeiliSearch')
    }
  }
}

// Run setup
setupMeiliSearch()