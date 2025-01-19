[![License: MIT](https://img.shields.io/badge/License-MIT-blueviolet.svg)](https://opensource.org/license/mit)
[![HTML](https://img.shields.io/badge/HTML-%23E34F26.svg?logo=html5&logoColor=white)](#)
[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?logo=javascript&logoColor=000)](#)
[![Visual Studio Code](https://custom-icon-badges.demolab.com/badge/Visual%20Studio%20Code-27313C.svg?logo=visual-studio-code)](https://code.visualstudio.com/)

> [!IMPORTANT]
> **This tool is free and open source. If someone asks you to pay for it, it's likely a scam.**

# [†] KCD Quest Marker - What is it :interrobang:

<img src="https://github.com/mi5hmash/KCD-Quest-Marker/blob/main/.resources/images/Banner.png" alt="Banner" width="600"/>

This tool is capable of patching **'*.pak'** localization files of **Kingdom Come: Deliverance**, so that a specific prefix appears for a selected quests. This way, the user can mark quests in a personalized manner, drawing attention to them during their playthrough.

<img src="https://github.com/mi5hmash/KCD-Quest-Marker/blob/main/.resources/images/Example.png" alt="Example"/>

# :scroll: How to use this tool
1. Visit [this site](https://mi5hmash.github.io/KCD-Quest-Marker/).
2. Select the **'*_xml.pak'** files from the ***'KingdomComeDeliverance\Localization\'*** directory. You can select all files in that folder and the tool will pick only the ones that are needed.
3. Expand the "Quest config" accordion. First, modify the Quest indicator according to your preferences. Then, you can proceed to the next editable input field and put there all the Quest IDs that you would like to mark. If there are multiple quests, then you should separate them with commas. You can click the "Load Quest IDs from the first file" button to view all possible Quest IDs. If you plan to use this configuration in the future, you can press the "Save config" button to store the field values from this section.
4. **(Optional)** Expand the "Manifest settings" accordion. There you can modify the metadata of the mod file you're about to create. If your game version differs from *1.9.6*, update the value of the **'KCD version'** field to correspond with your game version. If you plan to use this configuration in the future, you can press the "Save settings" button to store the field values from this section.
5. After configuring everything as desired, you can click the "Run" button located next to the field you used to load the **'*.pak'** files.
6. The tool will create and download a zip archive containing the mod. After downloading, extract it into the mods folder located in the game's main directory: ***"KingdomComeDeliverance\Mods"***.

## Default configuration
By default, this tool will create a mod that marks all quests with a time limit for their completion.

# :star: Sources
The inspiration for creating this tool came from [Timed Quest Indicator](https://www.nexusmods.com/kingdomcomedeliverance/mods/1780?tab=description) mod by [TyburnKetch](https://next.nexusmods.com/profile/TyburnKetch).
