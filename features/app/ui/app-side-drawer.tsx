'use client';

import ChevronLeftRoundedIcon from '@mui/icons-material/ChevronLeftRounded';
import ChevronRightRoundedIcon from '@mui/icons-material/ChevronRightRounded';
import PersonRoundedIcon from '@mui/icons-material/PersonRounded';
import SettingsRoundedIcon from '@mui/icons-material/SettingsRounded';
import SpaceDashboardRoundedIcon from '@mui/icons-material/SpaceDashboardRounded';
import {
  Box,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Stack,
  Tooltip,
} from '@mui/material';

import type { TranslationDictionary } from '@/shared/i18n/domain/i18n.types';

interface AppSideDrawerProps {
  displayName: string;
  isDesktopExpanded: boolean;
  isMobileOpen: boolean;
  onCloseMobile: () => void;
  onToggleDesktop: () => void;
  translations: TranslationDictionary;
}

const expandedDrawerWidth = 280;
const collapsedDrawerWidth = 88;

/**
 * Shared application side navigation with a collapsible desktop state.
 */
export function AppSideDrawer({
  displayName,
  isDesktopExpanded,
  isMobileOpen,
  onCloseMobile,
  onToggleDesktop,
  translations,
}: AppSideDrawerProps) {
  const t = translations.dashboard;
  const navigationItems = [
    {
      icon: <SpaceDashboardRoundedIcon color='primary' />,
      label: t.overview,
      secondary: t.workspace,
      selected: true,
    },
    {
      icon: <PersonRoundedIcon />,
      label: t.profile,
      secondary: displayName,
    },
    {
      icon: <SettingsRoundedIcon />,
      label: t.settings,
      secondary: t.workspace,
    },
  ];

  const drawerContent = (
    <Box
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        bgcolor: 'background.paper',
      }}
    >
      <Stack
        direction='row'
        alignItems='center'
        sx={{
          width: '100%',
          px: 1.5,
          py: 1,
          minHeight: 64,
          justifyContent: isDesktopExpanded ? 'flex-end' : 'center',
        }}
      >
        <IconButton
          aria-label={isDesktopExpanded ? t.collapseNavigation : t.expandNavigation}
          onClick={onToggleDesktop}
          sx={{
            display: { xs: 'none', md: 'inline-flex' },
            width: 52,
            height: 52,
            borderRadius: 3,
            color: 'text.secondary',
            '&:hover': {
              backgroundColor: 'action.hover',
            },
          }}
        >
          {isDesktopExpanded ? (
            <ChevronLeftRoundedIcon />
          ) : (
            <ChevronRightRoundedIcon />
          )}
        </IconButton>
      </Stack>

      <Divider />

      <List sx={{ px: 1.5, py: 1 }}>
        {navigationItems.map((item) => (
          <Tooltip
            key={item.label}
            placement='right'
            title={isDesktopExpanded ? '' : item.label}
          >
            <ListItemButton
              selected={item.selected}
              sx={{
                minHeight: 52,
                borderRadius: 3,
                justifyContent: isDesktopExpanded ? 'initial' : 'center',
                px: isDesktopExpanded ? 1.5 : 1,
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 0,
                  mr: isDesktopExpanded ? 1.5 : 0,
                  justifyContent: 'center',
                }}
              >
                {item.icon}
              </ListItemIcon>
              {isDesktopExpanded ? (
                <ListItemText
                  primary={item.label}
                  secondary={item.secondary}
                  slotProps={{
                    primary: { noWrap: true },
                    secondary: { noWrap: true },
                  }}
                />
              ) : null}
            </ListItemButton>
          </Tooltip>
        ))}
      </List>
    </Box>
  );

  return (
    <>
      <Drawer
        open={isMobileOpen}
        onClose={onCloseMobile}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': {
            width: expandedDrawerWidth,
            boxSizing: 'border-box',
          },
        }}
        variant='temporary'
      >
        {drawerContent}
      </Drawer>

      <Drawer
        open
        sx={{
          display: { xs: 'none', md: 'block' },
          width: isDesktopExpanded ? expandedDrawerWidth : collapsedDrawerWidth,
          flexShrink: 0,
          transition: (theme) =>
            theme.transitions.create('width', {
              duration: theme.transitions.duration.shorter,
            }),
          '& .MuiDrawer-paper': {
            position: 'relative',
            width: isDesktopExpanded ? expandedDrawerWidth : collapsedDrawerWidth,
            boxSizing: 'border-box',
            overflowX: 'hidden',
            borderRight: 1,
            borderColor: 'divider',
            transition: (theme) =>
              theme.transitions.create('width', {
                duration: theme.transitions.duration.shorter,
              }),
          },
        }}
        variant='permanent'
      >
        {drawerContent}
      </Drawer>
    </>
  );
}
