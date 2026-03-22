'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import ChevronLeftRoundedIcon from '@mui/icons-material/ChevronLeftRounded';
import ChevronRightRoundedIcon from '@mui/icons-material/ChevronRightRounded';
import FitnessCenterRoundedIcon from '@mui/icons-material/FitnessCenterRounded';
import PersonRoundedIcon from '@mui/icons-material/PersonRounded';
import SettingsRoundedIcon from '@mui/icons-material/SettingsRounded';
import SpaceDashboardRoundedIcon from '@mui/icons-material/SpaceDashboardRounded';
import {
  Box,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
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
 * @param props - Component props for the authenticated side drawer.
 * @param props.displayName - Display name used as secondary navigation context.
 * @param props.isDesktopExpanded - Indicates whether the desktop drawer is expanded.
 * @param props.isMobileOpen - Indicates whether the temporary mobile drawer is open.
 * @param props.onCloseMobile - Callback that closes the mobile drawer.
 * @param props.onToggleDesktop - Callback that toggles the desktop drawer width.
 * @param props.translations - The translation dictionary for the active language.
 * @returns A React element rendering both mobile and desktop drawer variants.
 * @remarks The component renders a temporary drawer on small screens and a permanent drawer on desktop.
 */
export function AppSideDrawer({
  displayName,
  isDesktopExpanded,
  isMobileOpen,
  onCloseMobile,
  onToggleDesktop,
  translations,
}: AppSideDrawerProps) {
  const pathname = usePathname();
  const t = translations.dashboard;
  const navigationItems = [
    {
      href: '/',
      icon: <SpaceDashboardRoundedIcon />,
      label: t.overview,
      secondary: t.workspace,
    },
    {
      href: '/profile',
      icon: <PersonRoundedIcon />,
      label: t.profile,
      secondary: displayName,
    },
    {
      href: '/exercises',
      icon: <FitnessCenterRoundedIcon />,
      label: t.exerciseAtlas,
      secondary: t.workspace,
    },
    {
      href: '/settings',
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

      <Box component='nav' aria-label={t.primaryNavigation}>
        <List sx={{ px: 1.5, py: 1 }}>
        {navigationItems.map((item) => (
          <Tooltip
            key={item.href}
            placement='right'
            title={isDesktopExpanded ? '' : item.label}
          >
            <ListItem disablePadding>
              <ListItemButton
                aria-current={pathname === item.href ? 'page' : undefined}
                component={Link}
                href={item.href}
                onClick={isMobileOpen ? onCloseMobile : undefined}
                selected={pathname === item.href}
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
            </ListItem>
          </Tooltip>
        ))}
        </List>
      </Box>
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
