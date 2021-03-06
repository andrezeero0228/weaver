import * as React from 'react';
import { observer } from 'mobx-react';
import store from '../../store';
import { Buttons, Sections, SettingsSection, Title, ListItem, DropArrow } from './style';
import { NavigationDrawer } from '../NavigationDrawer';
import { Content, Container, Scrollable } from '../Overlay/style';
import { ContextMenu, ContextMenuItem } from '~/renderer/app/components/ContextMenu';
import { icons } from '~/renderer/app/constants';
import { Input } from '~/renderer/app/components/Find/style';

const scrollRef = React.createRef<HTMLDivElement>();

const preventHiding = (e: any) => {
  e.stopPropagation();
};

store.settingsStore.currentDisplay = 'search_engine';

const onScroll = (e: any) => {
  const scrollPos = e.target.scrollTop;
  const scrollMax = e.target.scrollHeight - e.target.clientHeight - 256;

  if (scrollPos >= scrollMax) {
    store.arweaveApps.itemsLoaded += store.arweaveApps.getDefaultLoaded();
  }
};

const onBackClick = () => {
  scrollRef.current.scrollTop = 0;
  store.arweaveApps.resetLoadedItems();
};

/*** Search Engine ***/
const engineHex = '#585858c7';

const toggleSEMenu = (e: any) => {
  e.stopPropagation();
  store.settingsStore.searchEngineCtx = !store.settingsStore.searchEngineCtx;

  const engine = store.settingsStore.searchEngine;
  document.getElementById('ctx-item-g').style.backgroundColor = (engine === 'google') ? engineHex : '';
  document.getElementById('ctx-item-b').style.backgroundColor = (engine === 'bing') ? engineHex : '';
  document.getElementById('ctx-item-y').style.backgroundColor = (engine === 'yahoo') ? engineHex : '';
  document.getElementById('ctx-item-d').style.backgroundColor = (engine === 'duckduckgo') ? engineHex : '';
};

const setEngine = (ev: any, engine: 'google' | 'bing' | 'yahoo' | 'duckduckgo') => {
  ev.preventDefault();

  store.settingsStore.setSearchEngine(engine);
  store.settingsStore.searchEngineCtx = false;
  document.getElementById('ctx-item-g').style.backgroundColor = (engine === 'google') ? engineHex : '';
  document.getElementById('ctx-item-b').style.backgroundColor = (engine === 'bing') ? engineHex : '';
  document.getElementById('ctx-item-y').style.backgroundColor = (engine === 'yahoo') ? engineHex : '';
  document.getElementById('ctx-item-d').style.backgroundColor = (engine === 'duckduckgo') ? engineHex : '';
};

export const SearchEngines = observer(() => {
  return (
    <SettingsSection>
      <ListItem>
        <Title style={{ fontSize: '15px' }}>Search Engines ({store.settingsStore.searchEngine})</Title>
        <Buttons style={{ marginLeft: 'auto' }}>
          <DropArrow onClick={toggleSEMenu} />
          <ContextMenu id="search-engine-dp" visible={store.settingsStore.searchEngineCtx} style={{ marginLeft: '-61px' }}>
            <ContextMenuItem icon={icons.search} onClick={(e) => setEngine(e, 'google')} id="ctx-item-g">
              Google
            </ContextMenuItem>
            <ContextMenuItem onClick={(e) => setEngine(e, 'yahoo')} icon={icons.search} id="ctx-item-y">
              Yahoo
            </ContextMenuItem>
            <ContextMenuItem icon={icons.search} onClick={(e) => setEngine(e, 'bing')} id="ctx-item-b">
              Bing
            </ContextMenuItem>
            <ContextMenuItem icon={icons.search} onClick={(e) => setEngine(e, 'duckduckgo')}  id="ctx-item-d">
              DuckDuckGo
            </ContextMenuItem>
          </ContextMenu>
        </Buttons>
      </ListItem>

      <ListItem>
        <Title style={{ fontSize: '15px' }}>Server Port (restart Weaver if changed)</Title>
        <Input type="number" value={store.settingsStore.port} onChange={(e) => store.settingsStore.setPort(+e.target.value)} style={{ marginLeft: 'auto', width: '60px' }} />
      </ListItem>
    </SettingsSection>
  );
});

export const Settings = observer(() => {
  return (
    <Container
      right
      onClick={preventHiding}
      visible={
        store.overlay.currentContent === 'settings' && store.overlay.visible
      }
    >
      <Scrollable onScroll={onScroll} ref={scrollRef}>
        <NavigationDrawer
          title="Settings"
          onBackClick={onBackClick}
        />
        <Sections>
          <Content>
            {store.settingsStore.currentDisplay === 'search_engine' && <SearchEngines />}
          </Content>
        </Sections>
      </Scrollable>
    </Container>
  );
});
