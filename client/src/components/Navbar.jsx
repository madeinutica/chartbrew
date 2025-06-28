import React from 'react'
import { 
  Navbar as HeroNavbar, 
  NavbarBrand, 
  NavbarContent, 
  NavbarItem,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Avatar,
  Button
} from '@heroui/react'
import { useNavigate } from 'react-router-dom'

const Navbar = ({ user, onLogout }) => {
  const navigate = useNavigate()

  return (
    <HeroNavbar className="border-b border-divider">
      <NavbarBrand>
        <div className="flex items-center space-x-2">
          <img 
            src="https://chartbrew-static.b-cdn.net/logo_v2.png" 
            alt="Chartbrew" 
            className="w-8 h-8"
          />
          <span className="font-bold text-xl text-foreground">Chartbrew</span>
        </div>
      </NavbarBrand>

      <NavbarContent justify="end">
        <NavbarItem>
          <Dropdown placement="bottom-end">
            <DropdownTrigger>
              <Avatar
                isBordered
                as="button"
                className="transition-transform"
                color="primary"
                name={user?.name}
                size="sm"
                src={user?.avatar}
              />
            </DropdownTrigger>
            <DropdownMenu aria-label="Profile Actions" variant="flat">
              <DropdownItem key="profile" className="h-14 gap-2">
                <p className="font-semibold">Signed in as</p>
                <p className="font-semibold">{user?.email}</p>
              </DropdownItem>
              <DropdownItem 
                key="dashboard" 
                onPress={() => navigate('/dashboard')}
              >
                Dashboard
              </DropdownItem>
              <DropdownItem 
                key="settings" 
                onPress={() => navigate('/settings')}
              >
                Settings
              </DropdownItem>
              <DropdownItem 
                key="logout" 
                color="danger" 
                onPress={onLogout}
              >
                Log Out
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </NavbarItem>
      </NavbarContent>
    </HeroNavbar>
  )
}

export default Navbar