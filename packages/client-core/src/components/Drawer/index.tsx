import * as React from 'react'
import { styled, useTheme, Theme, CSSObject } from '@mui/material/styles'
import { useNavigate } from 'react-router-dom'
import MuiDrawer from '@mui/material/Drawer'
import Divider from '@mui/material/Divider'
import List from '@mui/material/List'
import BoltIcon from '@mui/icons-material/Bolt'
import ListItem from '@mui/material/ListItem'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import { useState } from 'react'
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh'
import { useLocation } from 'react-router-dom'
import StorageIcon from '@mui/icons-material/Storage'
import AutoStoriesIcon from '@mui/icons-material/AutoStories'
import SettingsIcon from '@mui/icons-material/Settings'
import { pluginManager } from '@magickml/engine'
import HubIcon from '@mui/icons-material/Hub'

import MagickLogo from './purple-logo-full.png'
import MagickLogoSmall from './purple-logo-small.png'

const drawerWidth = 150

const openedMixin = (theme: Theme): CSSObject => ({
  width: drawerWidth,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: 'hidden',
})

const closedMixin = (theme: Theme): CSSObject => ({
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: 'hidden',
  width: `calc(${theme.spacing(3)} + 1px)`,
  [theme.breakpoints.up('sm')]: {
    width: `calc(${theme.spacing(5)} + 1px)`,
  },
})

type HeaderProps = {
  open: boolean
}

const DrawerHeader = styled('div', {
  shouldForwardProp: prop => prop !== 'open',
})<HeaderProps>(({ theme, open }) => ({
  alignItems: 'center',
  justifyContent: 'flex-end',
  position: 'relative',
  left: 3,
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}))

const StyledDrawer = styled(MuiDrawer, {
  shouldForwardProp: prop => prop !== 'open',
})(({ theme, open }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: 'nowrap',
  boxSizing: 'border-box',
  ...(open && {
    ...openedMixin(theme),
    '& .MuiDrawer-paper': openedMixin(theme),
  }),
  ...(!open && {
    ...closedMixin(theme),
    '& .MuiDrawer-paper': closedMixin(theme),
  }),
}))

const DrawerItem = ({ Icon, open, text, active, onClick = () => {} }) => (
  <ListItem key={text} disablePadding sx={{ display: 'block' }}>
    <ListItemButton
      sx={{
        minHeight: 48,
        justifyContent: open ? 'initial' : 'center',
        px: 2.5,
      }}
      onClick={onClick}
    >
      <ListItemIcon
        sx={{
          minWidth: 0,
          mr: open ? 2 : 'auto',
          justifyContent: 'center',
          color: active ? 'var(--glow)' : 'white',
        }}
      >
        <Icon />
      </ListItemIcon>
      <ListItemText primary={text} sx={{ opacity: open ? 1 : 0 }} />
    </ListItemButton>
  </ListItem>
)

const PluginDrawerItems = ({onClick, open}) => {
  const drawerItems = pluginManager.getDrawerItems()
  let lastPlugin = null
  let divider = false
  return (
    <>
      {drawerItems.map((item, index) => {
        if (item.plugin !== lastPlugin) {
          divider = true
          lastPlugin = item.plugin
        } else {
          divider = false
        }
        return (
          <div
          key={item.path}
          >
          {divider && <Divider />}
          <DrawerItem
            key={item.path}
            active={location.pathname.includes(item.path)}
            Icon={item.icon}
            open={open}
            onClick={onClick(item.path)}
            text={item.text}
          />
          </div>
        )
      })}
    </>
  )
}

export function Drawer({ children }) {
  const location = useLocation()
  const navigate = useNavigate()

  const [open, setOpen] = useState<boolean>(false)

  const toggleDrawer = () => {
    setOpen(!open)
  }

  const onClick = location => () => {
    navigate(location)
  }

  return (
    <div style={{ display: 'flex', height: '100%' }}>
      <StyledDrawer variant="permanent" open={open}>
        <DrawerHeader
          open={open}
          onClick={toggleDrawer}
          sx={{ justifyContent: open ? 'space-between' : 'flex-end' }}
        >
          {
            <img
              style={{
                marginLeft: open ? '.5em' : '.0em',
                marginTop: '2em',
                height: 16,
                // on hover, show the finger cursor
                cursor: 'pointer',
              }}
              src={open ? MagickLogo : MagickLogoSmall}
              onClick={toggleDrawer}
              alt=""
            />
          }
        </DrawerHeader>
        <List
          sx={{
            padding: 0,
          }}
        >
          <DrawerItem
            active={location.pathname.includes('/magick')}
            Icon={AutoFixHighIcon}
            open={open}
            onClick={onClick('/magick')}
            text="Spells"
          />
          <DrawerItem
            active={location.pathname === '/events'}
            Icon={StorageIcon}
            open={open}
            onClick={onClick('/events')}
            text="Events"
          />
          <DrawerItem
            active={location.pathname === '/agents'}
            Icon={HubIcon}
            open={open}
            onClick={onClick('/agents')}
            text="Agents"
          />
          <DrawerItem
            active={location.pathname === '/requests'}
            Icon={BoltIcon}
            open={open}
            onClick={onClick('/requests')}
            text="Requests"
          />
          <PluginDrawerItems onClick={onClick} open={open} />
          <Divider />
          <DrawerItem
            active={location.pathname.includes('/settings')}
            Icon={SettingsIcon}
            open={open}
            onClick={onClick('/settings')}
            text="Settings"
          />
        </List>
      </StyledDrawer>
      {children}
    </div>
  )
}
