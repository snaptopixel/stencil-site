import { Component, Element, Prop, Watch, ComponentInterface, State } from '@stencil/core';
import siteStructure from '../../assets/docs-structure.json';
import { findItem } from '../../global/site-structure-utils';
import { SiteStructureItem } from '../../global/definitions';

@Component({
  tag: 'document-component',
  styleUrl: 'document-component.css'
})
export class DocumentComponent implements ComponentInterface {

  @Element() el!: HTMLElement;

  @Prop() page: string = null;

  @State() item: SiteStructureItem;
  @State() nextItem: SiteStructureItem;
  @State() prevItem: SiteStructureItem;
  @State() parent: SiteStructureItem;

  componentWillLoad() {
    return this.fetchNewContent(this.page);
  }

  @Watch('page')
  fetchNewContent(page: string, oldPage?: string) {
    if (page == null || page === oldPage) {
      return;
    }
    const foundData = findItem(siteStructure as SiteStructureItem[], this.page);
    this.item = foundData.item;
    this.nextItem = foundData.nextItem;
    this.prevItem = foundData.prevItem;
    this.parent = foundData.parent;
  }

  render() {
    if (this.item == null) {
      return null;
    }
    return (
      <div>
        <app-burger />
        <site-menu selectedParent={this.parent} siteStructureList={siteStructure as SiteStructureItem[]} />
        <app-marked fetchPath={this.item.filePath} renderer={(docsContent) => [
          <stencil-route-title
            pageTitle={docsContent.title ? `${docsContent.title} - Stencil` : 'Stencil'}></stencil-route-title>,
          <div class="doc-content">
            <div class="measure-lg">
              <div innerHTML={docsContent.content}></div>
              <lower-content-nav next={this.nextItem} prev={this.prevItem}></lower-content-nav>
            </div>
          </div>,
          <in-page-navigation
            pageLinks={docsContent.headings}
            srcUrl={docsContent.srcPath}
            currentPageUrl={docsContent.url}
          ></in-page-navigation>
        ]}/>
      </div>
    );
  }
}
