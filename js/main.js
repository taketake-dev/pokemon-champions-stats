const STAT_KEYS = [
  "hp",
  "attack",
  "defense",
  "sp_attack",
  "sp_defense",
  "speed",
  "total",
];

const STAT_LABELS = {
  hp: "HP",
  attack: "攻撃",
  defense: "防御",
  sp_attack: "特攻",
  sp_defense: "特防",
  speed: "素早",
  total: "合計",
};

const TYPE_CHANGED_CLASS = "type-changed";

function buildStatList(stats, values) {
  return stats
    .map((key) => {
      const value = values[key];
      const className = key === "total" ? ' class="total"' : "";
      return `<li${className}>${STAT_LABELS[key]}: ${value}</li>`;
    })
    .join("");
}

function buildMegaStatList(stats, megaStats, baseStats) {
  return stats
    .map((key) => {
      const diff = megaStats[key] - baseStats[key];
      const diffText = formatDiffText(diff);
      const className = key === "total" ? ' class="total"' : "";
      return `<li${className}>${STAT_LABELS[key]}: ${megaStats[key]} (${diffText})</li>`;
    })
    .join("");
}

function formatDiffText(diff) {
  if (diff > 0) return `<span class="diff-plus">+${diff}</span>`;
  if (diff < 0) return `<span class="diff-minus">${diff}</span>`;
  return `<span class="diff-zero">±0</span>`;
}

function areTypesEqual(baseTypes, megaTypes) {
  if (baseTypes.length !== megaTypes.length) return false;
  const sortedBase = [...baseTypes].sort();
  const sortedMega = [...megaTypes].sort();
  return sortedBase.every((type, index) => type === sortedMega[index]);
}

async function fetchPokemonData() {
  try {
    const response = await fetch("data/pokemon.json");
    const data = await response.json();
    displayPokemon(data);
  } catch (error) {
    console.error("データの読み込みに失敗しました:", error);
  }
}

function displayPokemon(pokemonList) {
  const container = document.getElementById("pokemon-container");
  container.innerHTML = "";

  pokemonList.forEach((pokemon) => {
    const card = document.createElement("div");
    card.className = "pokemon-card";

    const baseStatsList = buildStatList(STAT_KEYS, pokemon.base.stats);
    const megaHtml = pokemon.mega_evolutions
      .map((mega) => {
        const typeClass = areTypesEqual(pokemon.base.types, mega.types)
          ? ""
          : ` ${TYPE_CHANGED_CLASS}`;

        return `
          <div class="mega-section">
            <h3>${mega.name}</h3>
            <p class="type-row${typeClass}">タイプ: <span class="type-value">${mega.types.join(" / ")}</span></p>
            <p>特性: <strong>${mega.ability}</strong></p>
            <ul class="stat-list">${buildMegaStatList(STAT_KEYS, mega.stats, pokemon.base.stats)}</ul>
          </div>
        `;
      })
      .join("");

    card.innerHTML = `
      <h2>No.${pokemon.base.no} ${pokemon.base.name}</h2>
      <div class="base-section">
        <p class="type-row">タイプ: ${pokemon.base.types.join(" / ")}</p>
        <p>特性: ${pokemon.base.abilities.join(" / ")}</p>
        <ul class="stat-list">${baseStatsList}</ul>
      </div>
      ${megaHtml}
    `;

    container.appendChild(card);
  });
}

fetchPokemonData();
