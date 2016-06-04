Framework

Directory structure:

documentation
globals
libraries
modules
packages
scripts
system
tests
Framework.js

Documentation

Globals

Libraries

 Library code is organized in such a way that it can be used by multiple programs that have no connection to each other, while code that is part of a program is organized to only be used within that one program. This distinction can gain a hierarchical notion when a program grows large, such as a multi-million-line program. In that case, there may be internal libraries that are reused by independent sub-portions of the large program. The distinguishing feature is that a library is organized for the purposes of being reused by independent programs or sub-programs, and the user only needs to know the interface, and not the internal details of the library.

 The value of a library is the reuse of the behavior. When a program invokes a library, it gains the behavior implemented inside that library without having to implement that behavior itself. Libraries encourage the sharing of code in a modular fashion, and ease the distribution of the code.

Modules

  Used to configure project settings.

Packages
  
  Packages contain code which is too specific to be part of /system. Packages can exist in an ecosystem and be downloaded and shared. Community packages may be incorporated into /system.

Scripts

  Shortcuts to run code.

System

  Core files.

Tests

Framework.js