import React from 'react'
import PropTypes from 'prop-types'
import { graphql } from 'gatsby'

import { Layout, PostCard, Pagination } from '../components/common'
import { MetaData } from '../components/common/meta'
import LanguageAwareTemplate from '../components/abstract/LanguageAwareTemplate'

/**
 * Main index page (home page)
 *
 * Loads all posts from Ghost and uses pagination to navigate through them.
 * Filters the content based on the `languageTag` prop
 * The number of posts that should appear per page can be setup
 * in /utils/siteConfig.js under `postsPerPage`.
 *
 */
class Index extends LanguageAwareTemplate {
    render() {
        const { data, location, pageContext } = this.props
        const posts = data.allGhostPost.edges

        return (
            <>
                <MetaData location={location} />
                <Layout isHome={true}>
                    <section>
                        {posts.map(({ node }) => (
                            // The tag below includes the markup for each post - components/common/PostCard.js
                            <PostCard key={node.id} post={node} />
                        ))}
                    </section>
                    <Pagination pageContext={pageContext} />
                </Layout>
            </>
        )
    }
}

Index.propTypes = {
    data: PropTypes.shape({
        allGhostPost: PropTypes.object.isRequired,
    }).isRequired,
    location: PropTypes.shape({
        pathname: PropTypes.string.isRequired,
    }).isRequired,
    pageContext: PropTypes.object,
}

export default Index

// This page query loads all posts sorted descending by published date
// The `limit` and `skip` values are used for pagination
export const pageQuery = graphql`
  query GhostPostQuery($limit: Int!, $skip: Int!, $languageTag: String!) {
    allGhostPost(
        sort: { order: DESC, fields: [published_at] },
        limit: $limit,
        skip: $skip,
        filter: { tags: { elemMatch: { name: { eq: $languageTag } } } }
    ) {
      edges {
        node {
          ...GhostPostFields
        }
      }
    }
  }
`
