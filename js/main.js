const STAT_KEYS = [
  "hp",
  "attack",
  "defense",
  "sp_attack",
  "sp_defense",
  "speed",
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
      return `<li><span class="stat-label">${STAT_LABELS[key]}</span><span class="stat-value">${values[key]}</span></li>`;
    })
    .join("");
}

function buildMegaStatList(stats, megaStats, baseStats) {
  return stats
    .map((key) => {
      const diff = megaStats[key] - baseStats[key];
      const diffText = formatDiffText(diff);
      return `<li><span class="stat-label">${STAT_LABELS[key]}</span><span class="stat-value">${megaStats[key]} (${diffText})</span></li>`;
    })
    .join("");
}

function buildTotalList(total) {
  return `<ul class="total-list"><li class="total">${STAT_LABELS.total}: ${total}</li></ul>`;
}

function buildMegaTotalList(total, baseTotal) {
  const diff = total - baseTotal;
  const diffText = formatDiffText(diff);
  return `<ul class="total-list"><li class="total">${STAT_LABELS.total}: ${total} (${diffText})</li></ul>`;
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
    const baseTotalList = buildTotalList(pokemon.base.stats.total);
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
            <div class="stat-group">
              <ul class="stat-list">${buildMegaStatList(STAT_KEYS, mega.stats, pokemon.base.stats)}</ul>
              ${buildMegaTotalList(mega.stats.total, pokemon.base.stats.total)}
            </div>
          </div>
        `;
      })
      .join("");

    card.innerHTML = `
      <h2>No.${pokemon.base.no} ${pokemon.base.name}</h2>
      <div class="base-section">
        <p class="type-row">タイプ: ${pokemon.base.types.join(" / ")}</p>
        <p>特性: ${pokemon.base.abilities.join(" / ")}</p>
        <div class="stat-group">
          <ul class="stat-list">${baseStatsList}</ul>
          ${baseTotalList}
        </div>
      </div>
      ${megaHtml}
    `;

    container.appendChild(card);
  });
}

fetchPokemonData();
